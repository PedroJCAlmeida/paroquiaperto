package com.paroquiaperto.backend.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeoNamesService {
    @Value("${geonames.username:demo}")
    private String geoNamesUsername;

    private final RestTemplate restTemplate = new RestTemplate();

    public GeoInfo buscarPorCodigoPostal(String postalCode) {
        String url = String.format(
            "http://api.geonames.org/postalCodeLookupJSON?postalcode=%s&country=PT&username=%s",
            postalCode, geoNamesUsername
        );
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        JSONObject json = new JSONObject(response.getBody());
        JSONArray postalcodes = json.optJSONArray("postalcodes");
        if (postalcodes != null && postalcodes.length() > 0) {
            JSONObject obj = postalcodes.getJSONObject(0);
            String placeName = obj.optString("placeName");
            String adminName1 = obj.optString("adminName1"); // Distrito
            String adminName2 = obj.optString("adminName2"); // Conselho
            return new GeoInfo(placeName, adminName1, adminName2);
        }
        return null;
    }

    public static class GeoInfo {
        public final String placeName;
        public final String distrito;
        public final String conselho;
        public GeoInfo(String placeName, String distrito, String conselho) {
            this.placeName = placeName;
            this.distrito = distrito;
            this.conselho = conselho;
        }
    }
}
