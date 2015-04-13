package com.networknt.light.rule.catalog;

import com.networknt.light.rule.Rule;

import java.util.Map;

/**
 * Created by steve on 30/03/15.
 *
 * AccessLevel A
 */
public class GetCatalogTreeRule extends AbstractCatalogRule implements Rule {
    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        String host = (String)data.get("host");
        String json = getCatalogTree(host);
        if(json != null) {
            inputMap.put("result", json);
            return true;
        } else {
            inputMap.put("result", "No document can be found");
            inputMap.put("responseCode", 404);
            return false;
        }
    }
}
