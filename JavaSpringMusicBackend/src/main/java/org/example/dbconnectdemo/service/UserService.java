package org.example.dbconnectdemo.service;

import org.example.dbconnectdemo.dto.SongListDto;
import org.example.dbconnectdemo.dto.SongDto;
import org.example.dbconnectdemo.dto.TransferPageObject;
import org.example.dbconnectdemo.dto.UserDto;
import org.example.dbconnectdemo.model.Song;
import org.example.dbconnectdemo.model.SongList;
import org.example.dbconnectdemo.model.User;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.TagException;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface UserService{
    User getUserData(String username, String fingerprint);

    String getUserAvatar(String username, String fingerprint);

    User uploadUserAvatar(String username, MultipartFile file, String fingerprint) throws IOException;

    String getUserBackground(String username, String fingerprint);

    User uploadUserBackground(String username, MultipartFile file, String fingerprint) throws IOException;

    void deleteUser(String username, String inputPassword, String fingerprint);

    TransferPageObject getAllUserSongsWithSortAndPaging(String username, int pageNo, int pageSize, String field, String direction, String fingerprint);

    TransferPageObject searchAllUserSongsLikeNameWithSortAndPaging(String username,int pageNo,int pageSize,String sortField, String direction, String name, String fingerprint);

    TransferPageObject searchAllUserSongsLikeArtistWithSortAndPaging(String username,int pageNo,int pageSize,String sortField, String direction, String name, String fingerprint);

    Song getUserSong(String username, Long songId);

    TransferPageObject getAllUserFavoriteSongsWithSortAndPaging(String username,int pageNo,int pageSize, String field, String direction, String fingerprint);

    TransferPageObject searchAllUserFavoriteSongsLikeNameWithSortAndPaging(String username, int pageNo, int pageSize,String sortField, String direction, String name, String fingerprint);

    TransferPageObject searchAllUserFavoriteSongsLikeArtistWithSortAndPaging(String username, int pageNo, int pageSize,String sortField, String direction, String name, String fingerprint);

    SongDto updateUserFavoriteSong(String username, Long songId, boolean isFavorite, String fingerprint);

    List<SongDto> addSongsToUser(String username, MultipartFile[] files, String fingerprint) throws IOException, CannotReadException, TagException, ReadOnlyFileException, InvalidAudioFrameException;

    SongDto deleteSongFromUser(String username, Long id, String fingerprint);

    void createUserCustomList(String username, String listName, String fingerprint);

    List<SongListDto> getAllUserCustomLists(String username, String fingerprint);

    SongList getUserCustomList(String username, Long id, String fingerprint);

    SongList deleteUserCustomList(String username, Long id, String fingerprint);

    SongList updateUserCustomList(String username, Long id, String listName, String fingerprint);

    String addSongToCustomList(String username, Long listId, Long songId, String fingerprint);

    String removeSongFromCustomList(String username, Long listId, Long songId, String fingerprint);
}
