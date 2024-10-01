package org.example.dbconnectdemo.utilities;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dbconnectdemo.model.Song;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.*;

@Component
public class GeneralUtility {

    public static void sortSongs(List<Song> songs, String field, String direction){
        if(field.equals("name")){
            songs.sort(Comparator.comparing(Song::getName));
        }
        if(field.equals("artist")){
            songs.sort(Comparator.comparing(Song::getArtist));
        }
        if(field.equals("duration")){
            songs.sort(Comparator.comparing(Song::getDuration));
        }
        if(field.equals("size")){
            songs.sort(Comparator.comparing(Song::getSize));
        }
        if(field.equals("uploadDate")){
            songs.sort(Comparator.comparing(Song::getUploadDate));
        }
        if(direction.equals("desc")){
            Collections.reverse(songs);
        }
    }

    public static String sha256(String base) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(base.getBytes("UTF-8"));
            StringBuffer hexString = new StringBuffer();

            for (int i = 0; i < hash.length; i++) {
                String hex = Integer.toHexString(0xff & hash[i]);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public static String base64UrlDecode(String base64Raw) {
        String base64 = base64Raw.replace('-', '+').replace('_', '/');

        switch (base64.length() % 4) {
            case 2: base64 += "=="; break;
            case 3: base64 += "="; break;
        }

        byte[] decodedBytes = Base64.getDecoder().decode(base64);
        return new String(decodedBytes);
    }
}


