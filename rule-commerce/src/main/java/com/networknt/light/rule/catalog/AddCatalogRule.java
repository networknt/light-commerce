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
import com.networknt.light.rule.catalog.AbstractCatalogRule;
import com.networknt.light.server.DbService;
import com.networknt.light.util.HashUtil;
import com.networknt.light.util.ServiceLocator;
import com.orientechnologies.orient.core.record.impl.ODocument;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.impls.orient.OrientGraph;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by steve on 10/14/2014.
 *
 * AccessLevel R [owner, admin, catalogAdmin]
 */
public class AddCatalogRule extends AbstractCatalogRule implements Rule {
    static final Logger logger = LoggerFactory.getLogger(AddCatalogRule.class);

    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>)payload.get("user");
        String host = (String) data.get("host");
        String catalogId = (String)data.get("catalogId");
        String error = null;
        String userHost = (String)user.get("host");
        if(userHost != null && !userHost.equals(host)) {
            error = "You can only add catalog from host: " + host;
            inputMap.put("responseCode", 403);
        } else {
            Map eventMap = getEventMap(inputMap);
            Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
            inputMap.put("eventMap", eventMap);
            eventData.putAll((Map<String, Object>) inputMap.get("data"));
            eventData.put("createDate", new java.util.Date());
            eventData.put("createUserId", user.get("userId"));
            OrientGraph graph = ServiceLocator.getInstance().getGraph();
            try {
                ODocument catalog = getODocumentByHostId(graph, "catalogHostIdIdx", host, catalogId);
                if(catalog != null) {
                    error = "Id " + catalogId + " exists on host " + host;
                    inputMap.put("responseCode", 400);
                } else {
                    // make sure parent exists if it is not empty.
                    List<String> parentRids = (List<String>)data.get("in_Own");
                    if(parentRids != null && parentRids.size() == 1) {
                        Vertex parent = DbService.getVertexByRid(graph, parentRids.get(0));
                        if(parent == null) {
                            error = "Parent with @rid " + parentRids.get(0) + " cannot be found.";
                            inputMap.put("responseCode", 404);
                        } else {
                            // convert parent from @rid to id
                            List in_Own = new ArrayList();
                            in_Own.add(parent.getProperty("catalogId"));
                            eventData.put("in_Own", in_Own);
                        }
                    }
                    if(error == null) {
                        // make sure all children exist if there are any.
                        // and make sure all children have empty parent.
                        List<String> childrenRids = (List<String>)data.get("out_Own");
                        if(childrenRids != null && childrenRids.size() > 0) {
                            List<String> out_Own = new ArrayList<String>();
                            for(String childRid: childrenRids) {
                                if(childRid != null) {
                                    if(parentRids!= null && childRid.equals(parentRids.get(0))) {
                                        error = "Parent shows up in the Children list";
                                        inputMap.put("responseCode", 400);
                                        break;
                                    }
                                    Vertex child = DbService.getVertexByRid(graph, childRid);
                                    if(child == null) {
                                        error = "Child with @rid " + childRid + " cannot be found.";
                                        inputMap.put("responseCode", 404);
                                        break;
                                    } else {
                                        out_Own.add((String)child.getProperty("catalogId"));
                                    }
                                }
                            }
                            eventData.put("out_Own", out_Own);
                        }
                    }
                    if(error == null) {
                        eventMap.put("catalogId", HashUtil.generateUUID());
                    }
                }
            } catch (Exception e) {
                logger.error("Exception:", e);
                throw e;
            } finally {
                graph.shutdown();
            }
        }
        if(error != null) {
            inputMap.put("result", error);
            return false;
        } else {
            return true;
        }
    }
}
