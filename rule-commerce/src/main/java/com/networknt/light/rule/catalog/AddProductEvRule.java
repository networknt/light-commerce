package com.networknt.light.rule.catalog;

import com.networknt.light.rule.Rule;

import java.util.Map;

/**
 * Created by steve on 30/03/15.
 */
public class AddProductEvRule extends AbstractCatalogRule implements Rule {
    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> eventMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>) eventMap.get("data");
        addProduct(data);
        return true;
    }
}
