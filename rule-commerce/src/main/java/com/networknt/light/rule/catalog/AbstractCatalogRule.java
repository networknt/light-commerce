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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.googlecode.concurrentlinkedhashmap.ConcurrentLinkedHashMap;
import com.networknt.light.rule.AbstractRule;
import com.networknt.light.rule.Rule;
import com.networknt.light.server.DbService;
import com.networknt.light.util.ServiceLocator;
import com.orientechnologies.orient.core.db.document.ODatabaseDocumentTx;
import com.orientechnologies.orient.core.db.record.OIdentifiable;
import com.orientechnologies.orient.core.id.ORecordId;
import com.orientechnologies.orient.core.index.OCompositeKey;
import com.orientechnologies.orient.core.index.OIndex;
import com.orientechnologies.orient.core.metadata.schema.OSchema;
import com.orientechnologies.orient.core.record.impl.ODocument;
import com.orientechnologies.orient.core.serialization.serializer.OJSONWriter;
import com.orientechnologies.orient.core.sql.query.OSQLSynchQuery;
import com.tinkerpop.blueprints.Direction;
import com.tinkerpop.blueprints.Edge;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.impls.orient.OrientGraph;
import com.tinkerpop.blueprints.impls.orient.OrientVertex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentMap;

/**
 * Created by steve on 10/14/2014.
 */
public abstract class AbstractCatalogRule extends AbstractRule implements Rule {
    static final Logger logger = LoggerFactory.getLogger(AbstractCatalogRule.class);

    ObjectMapper mapper = ServiceLocator.getInstance().getMapper();
    public abstract boolean execute (Object ...objects) throws Exception;

    protected Vertex getCatalogByHostId(OrientGraph graph, String host, String catalogId) {
        Vertex catalog = null;
        OIndex<?> hostIdIdx = graph.getRawGraph().getMetadata().getIndexManager().getIndex("catalogHostIdIdx");
        // this is a unique index, so it retrieves a OIdentifiable
        OCompositeKey key = new OCompositeKey(host, catalogId);
        OIdentifiable oid = (OIdentifiable) hostIdIdx.get(key);
        if (oid != null) {
            catalog = graph.getVertex(oid.getRecord());
        }
        return catalog;
    }

    protected void addCatalog(Map<String, Object> data) throws Exception {
        String host = (String)data.get("host");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex createUser = graph.getVertexByKey("User.userId", data.remove("createUserId"));
            List<String> parentIds = (List<String>)data.remove("in_Own");
            List<String> childrenIds = (List<String>)data.remove("out_Own");
            OrientVertex catalog = graph.addVertex("class:Catalog", data);
            createUser.addEdge("Create", catalog);
            // parent
            if(parentIds != null && parentIds.size() == 1) {
                Vertex parent = getCatalogByHostId(graph, host, parentIds.get(0));
                if(parent != null) {
                    parent.addEdge("Own", catalog);
                }
            }
            // children
            if(childrenIds != null) {
                for(String childId: childrenIds) {
                    Vertex child = getCatalogByHostId(graph, host, childId);
                    if(child != null) {
                        catalog.addEdge("Own", child);
                    }
                }
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    protected void addProduct(Map<String, Object> data) throws Exception {
        String host = (String)data.get("host");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex createUser = graph.getVertexByKey("User.userId", data.remove("createUserId"));
            OrientVertex product = graph.addVertex("class:Product", data);
            createUser.addEdge("Create", product);
            // parent
            Vertex parent = getCatalogByHostId(graph, host, (String) data.get("parentId"));
            if(parent != null) {
                parent.addEdge("HasProduct", product);
            }
            // tag
            Set<String> inputTags = data.get("tags") != null? new HashSet<String>(Arrays.asList(((String) data.get("tags")).split("\\s*,\\s*"))) : new HashSet<String>();
            for(String tagId: inputTags) {
                Vertex tag = null;
                // get the tag is it exists
                OIndex<?> tagHostIdIdx = graph.getRawGraph().getMetadata().getIndexManager().getIndex("tagHostIdIdx");
                logger.debug("tagHostIdIdx = " + tagHostIdIdx);
                OCompositeKey tagKey = new OCompositeKey(host, tagId);
                logger.debug("tagKey =" + tagKey);
                OIdentifiable tagOid = (OIdentifiable) tagHostIdIdx.get(tagKey);
                if (tagOid != null) {
                    tag = graph.getVertex(tagOid.getRecord());
                    product.addEdge("HasTag", tag);
                } else {
                    tag = graph.addVertex("class:Tag", "host", host, "tagId", tagId, "createDate", data.get("createDate"));
                    createUser.addEdge("Create", tag);
                    product.addEdge("HasTag", tag);
                }
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    protected void delCatalog(Map<String, Object> data) throws Exception {
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex catalog = getCatalogByHostId(graph, (String)data.get("host"), (String)data.get("catalogId"));
            if(catalog != null) {
                graph.removeVertex(catalog);
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    protected void updCatalog(Map<String, Object> data) throws Exception {
        String host = (String)data.get("host");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try{
            graph.begin();
            Vertex updateUser = graph.getVertexByKey("User.userId", data.remove("updateUserId"));
            Vertex catalog = getCatalogByHostId(graph, host, (String) data.get("catalogId"));
            if (catalog != null) {
                if(data.get("description") != null) {
                    catalog.setProperty("description", data.get("description"));
                } else {
                    catalog.removeProperty("description");
                }
                if(data.get("attributes") != null) {
                    catalog.setProperty("attributes", data.get("attributes"));
                } else {
                    catalog.removeProperty("attributes");
                }
                catalog.setProperty("updateDate", data.get("updateDate"));

                // parent
                String delParentId = (String)data.get("delParentId");
                if(delParentId != null) {
                    for (Edge edge : (Iterable<Edge>) catalog.getEdges(Direction.IN, "Own")) {
                        graph.removeEdge(edge);
                    }
                }
                String addParentId = (String)data.get("addParentId");
                if(addParentId != null) {
                    Vertex parent = getCatalogByHostId(graph, host, addParentId);
                    if (parent != null) {
                        parent.addEdge("Own", catalog);
                    }
                }

                // handle addChildren and delChildren
                Set<String> addChildren = (Set)data.get("addChildren");
                if(addChildren != null) {
                    for(String childId: addChildren) {
                        Vertex vertex = getCatalogByHostId(graph, host, childId);
                        catalog.addEdge("Own", vertex);
                    }
                }
                Set<String> delChildren = (Set)data.get("delChildren");
                if(delChildren != null) {
                    for(String childId: delChildren) {
                        Vertex vertex = getCatalogByHostId(graph, host, childId);
                        for (Edge edge : (Iterable<Edge>) catalog.getEdges(Direction.OUT, "Own")) {
                            if(edge.getVertex(Direction.IN).equals(vertex)) graph.removeEdge(edge);
                        }
                    }
                }
                // updateUser
                updateUser.addEdge("Update", catalog);
            }
            graph.commit();
        } catch (Exception e) {
            logger.error("Exception:", e);
            graph.rollback();
        } finally {
            graph.shutdown();
        }
    }

    protected String getCatalogTree(String host) {
        String json = null;
        String sql = "SELECT FROM Catalog WHERE host = ? and in_Own IS NULL ORDER BY id";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> docs = graph.getRawGraph().command(query).execute(host);
            if(docs.size() > 0) {
                json = OJSONWriter.listToJSON(docs, "rid,fetchPlan:out_Own.in_Create:-2 out_Own.out_Create:-2 out_Own:-1");
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

    protected String getCatalog(String host) {
        String json = null;
        String sql = "SELECT FROM Catalog WHERE host = ? ORDER BY createDate";
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            OSQLSynchQuery<ODocument> query = new OSQLSynchQuery<ODocument>(sql);
            List<ODocument> docs = graph.getRawGraph().command(query).execute(host);
            if(docs.size() > 0) {
                json = OJSONWriter.listToJSON(docs, null);
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
        } finally {
            graph.shutdown();
        }
        return json;
    }

}
