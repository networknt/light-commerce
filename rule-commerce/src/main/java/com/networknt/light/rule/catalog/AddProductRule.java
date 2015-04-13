package com.networknt.light.rule.catalog;

import com.networknt.light.rule.Rule;
import com.networknt.light.util.HashUtil;
import com.networknt.light.util.ServiceLocator;
import com.tinkerpop.blueprints.Vertex;
import com.tinkerpop.blueprints.impls.orient.OrientGraph;
import com.tinkerpop.blueprints.impls.orient.OrientVertex;

import java.util.Map;

/**
 * Created by steve on 30/03/15.
 *
 * AccessLevel R [owner, admin, catalogAdmin]
 */
public class AddProductRule extends AbstractCatalogRule implements Rule {
    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) inputMap.get("data");
        String parentId = (String) data.get("parentId");
        String host = (String) data.get("host");
        String error = null;
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        OrientGraph graph = ServiceLocator.getInstance().getGraph();
        try {
            Vertex parent = getCatalogByHostId(graph, host, parentId);
            if(parent == null) {
                error = "Id " + parentId + " doesn't exist on host " + host;
                inputMap.put("responseCode", 400);
            } else {
                Map<String, Object> user = (Map<String, Object>)payload.get("user");
                Map eventMap = getEventMap(inputMap);
                Map<String, Object> eventData = (Map<String, Object>)eventMap.get("data");
                inputMap.put("eventMap", eventMap);
                eventData.putAll((Map<String, Object>) inputMap.get("data"));
                eventData.put("createDate", new java.util.Date());
                eventData.put("createUserId", user.get("userId"));
                eventData.put("sku", HashUtil.generateUUID());
            }
        } catch (Exception e) {
            logger.error("Exception:", e);
            throw e;
        } finally {
            graph.shutdown();
        }
        if(error != null) {
            inputMap.put("result", error);
            return false;
        } else {
            return true;
        }

    }

}
