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
import com.orientechnologies.orient.core.record.impl.ODocument;

import java.util.Map;

/**
 * Created by husteve on 10/14/2014.
 */
public class GetCatalogRule extends AbstractCatalogRule implements Rule {
    public boolean execute (Object ...objects) throws Exception {
        Map<String, Object> inputMap = (Map<String, Object>) objects[0];
        Map<String, Object> data = (Map<String, Object>)inputMap.get("data");
        Map<String, Object> payload = (Map<String, Object>) inputMap.get("payload");
        Map<String, Object> user = (Map<String, Object>) payload.get("user");
        String host = (String)data.get("host");
        Object userHost = user.get("host");
        if(userHost != null && !userHost.equals(host)) {
            inputMap.put("result", "You can only get catalog from host: " + host);
            inputMap.put("responseCode", 403);
            return false;
        } else {
            String docs = getCatalog(host);
            if(docs != null) {
                inputMap.put("result", docs);
                return true;
            } else {
                inputMap.put("result", "No document can be found");
                inputMap.put("responseCode", 404);
                return false;
            }
        }
    }
}
