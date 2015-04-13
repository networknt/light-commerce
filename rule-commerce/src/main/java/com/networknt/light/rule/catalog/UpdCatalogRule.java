/*
 * Copyright 2015 Network New Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.networknt.light.rule.catalog;

import com.networknt.light.rule.Rule;
import com.networknt.light.server.DbService;
import com.networknt.light.util.ServiceLocator;
import com.orientechnologies.orient.core.record.impl.ODocument;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.impls.orient.OrientGraph;

import java.util.*;

/**
 * Created by husteve on 10/14/2014.
 */
public class UpdCatalogRule extends AbstractCatalogRule implements Rule {
    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        String rid = (String) data.get("@rid");
        String host = (String) data.get("host");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>)payload.get("user");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            String userHost = (String)user.get("host");
            if(userHost != null && !userHost.equals(host)) {
                inputMap.put("result", "You can only update catalog from host: " + host);
                inputMap.put("responseCode", 403);
                return false;
            } else {
                Vertex catalog = DbService.getVertexByRid(graph, rid);
                if(catalog != null) {
                    Map eventMap = getEventMap(inputMap);
                    Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
                    inputMap.put("eventMap", eventMap);
                    eventData.putAll((Map<String, Object>)inputMap.get("data"));
                    eventData.put("updateDate", new java.util.Date());
                    eventData.put("updateUserId", user.get("userId"));

                    // make sure parent exists if it is not empty.
                    List parentRids = (List)data.get("in_Own");
                    if(parentRids != null) {
                        if(rid.equals(parentRids.get(0))) {
                            inputMap.put("result", "parent @rid is the same as current @rid");
                            inputMap.put("responseCode", 400);
                            return false;
                        }
                        Vertex parent = DbService.getVertexByRid(graph, (String)parentRids.get(0));
                        if(parent != null) {
                            String storedParentRid = null;
                            String storedParentId = null;
                            for (Vertex vertex : (Iterable<Vertex>) catalog.getVertices(Direction.IN, "Own")) {
                                // we only expect one parent here.
                                storedParentRid = vertex.getId().toString();
                                storedParentId = vertex.getProperty("catalogId");
                            }
                            if(parentRids.get(0).equals(storedParentRid)) {
                                // same parent, do nothing
                            } else {
                                eventData.put("delParentId", storedParentId);
                                eventData.put("addParentId", parent.getProperty("catalogId"));
                            }
                        } else {
                            inputMap.put("result", "Parent with @rid " + parentRids.get(0) + " cannot be found");
                            inputMap.put("responseCode", 404);
                            return false;
                        }
                    }
                    // make sure all children exist if there are any.
                    // and make sure all children have empty parent.
                    List<String> childrenRids = (List<String>)data.get("out_Own");
                    if(childrenRids != null && childrenRids.size() > 0) {
                        List<String> childrenIds = new ArrayList<String>();
                        Set<String> inputChildren = new HashSet<String>();
                        for(String childRid: childrenRids) {
                            if(parentRids != null && childRid.equals(parentRids.get(0))) {
                                inputMap.put("result", "Parent shows up in the Children list");
                                inputMap.put("responseCode", 400);
                                return false;
                            }
                            if(childRid.equals(rid)) {
                                inputMap.put("result", "Current object shows up in the Children list");
                                inputMap.put("responseCode", 400);
                                return false;
                            }
                            Vertex child = DbService.getVertexByRid(graph, childRid);
                            if(child == null) {
                                inputMap.put("result", "Child with @rid " + childRid + " cannot be found");
                                inputMap.put("responseCode", 404);
                                return false;
                            } else {
                                inputChildren.add((String)child.getProperty("catalogId"));
                            }
                        }
                        Set<String> storedChildren = new HashSet<String>();
                        for (Vertex vertex : (Iterable<Vertex>) catalog.getVertices(Direction.OUT, "Own")) {
                            storedChildren.add((String)vertex.getProperty("catalogId"));
                        }

                        Set<String> addChildren = new HashSet<String>(inputChildren);
                        Set<String> delChildren = new HashSet<String>(storedChildren);
                        addChildren.removeAll(storedChildren);
                        delChildren.removeAll(inputChildren);

                        if(addChildren.size() > 0) eventData.put("addChildren", addChildren);
                        if(delChildren.size() > 0) eventData.put("delChildren", delChildren);
                    }
                } else {
                    inputMap.put("result",  "@rid " + rid + " cannot be found");
                    inputMap.put("responseCode", 404);
                    return false;
                }
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
            throw e;
        } finally {
            graph.shutdown();
        }
        return true;
    }
}
