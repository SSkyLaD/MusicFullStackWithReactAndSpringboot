package org.example.dbconnectdemo.controller;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.example.dbconnectdemo.dto.*;
import org.example.dbconnectdemo.dto.Response.BaseResponse;
import org.example.dbconnectdemo.dto.Response.PageResponse;
import org.example.dbconnectdemo.dto.Response.ObjectResponse;
import org.example.dbconnectdemo.dto.Response.ListResponse;
import org.example.dbconnectdemo.exception.InvalidInputException;
import org.example.dbconnectdemo.map.SongMapper;
import org.example.dbconnectdemo.model.Song;
import org.example.dbconnectdemo.model.SongList;
import org.example.dbconnectdemo.model.User;
import org.example.dbconnectdemo.service.UserService;
import org.example.dbconnectdemo.utilities.JwtUtility;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {

    private final JwtUtility jwtUtility;
    private final UserService userService;

    @GetMapping
    private ResponseEntity<Object> getUserData() {
        @lombok.Data
        @AllArgsConstructor
        @NoArgsConstructor
        class Data {
            private String username;
            private Date accountCreateDate;
            private int numberOfSong;
            private int numberOfPlaylist;
            private double availableMemory;
            private String avatarImage;
            private String backgroundImage;
        }
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserData(username);
            Data resData = new Data(user.getUsername(),  user.getCreateDate(), user.getSumOfSongs(),user.getUserSongLists().size(), user.getAvailableMemory() / (1024 * 1024), user.getUserAvatar(),user.getUserBackground());
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!",resData));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @GetMapping("/avatar")
    private ResponseEntity<Object> getUserAvatar() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String userAvatar = userService.getUserAvatar(username);
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!", userAvatar));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error!"));
        }
    }

    @PostMapping("/avatar/upload")
    private ResponseEntity<Object> uploadUserAvatar(@RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.uploadUserAvatar(username,file);
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!",user.getUserAvatar()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error!"));
        }
    }

    @GetMapping("/background")
    private ResponseEntity<Object> getUserBackground() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String userBackground = userService.getUserBackground(username);
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!", userBackground));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error!"));
        }
    }

    @PostMapping("/background/upload")
    private ResponseEntity<Object> uploadUserBackground(@RequestParam("file") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.uploadUserBackground(username,file);
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!", user.getUserBackground()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error!"));
        }
    }

    @PostMapping("/delete")
    private ResponseEntity<Object> deleteUser(@RequestBody Map<String, String> password) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            userService.deleteUser(username, password.get("password"));
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,"User " + username + " delete successfully!"));
        } catch (InvalidInputException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        } catch (Exception e){
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    // Allow Sort by all field in song, uploadDate ASC and DESC
    // api/v1/users/songs?pageNo=0&sortField=name&direction=asc
    // Can replace with searchAPI name=""
    @GetMapping("/songs")
    private ResponseEntity<Object> getUserSongs(@RequestParam(required = false) Map<String, String> qparams) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            int pageNo = qparams.get("pageNo") == null ? 0 : Integer.parseInt(qparams.get("pageNo"));
            int pageSize = 30; // fix pageSize = 20;
            String field = qparams.get("sortField") == null ? "uploadDate" : qparams.get("sortField");
            String direction = qparams.get("direction") == null ? "asc" : qparams.get("direction");
            TransferPageObject data = userService.getAllUserSongsWithSortAndPaging(username, pageNo, pageSize, field, direction);
            return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!",pageNo,data.totalPage(),data.totalResult(),data.data()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400, "Error"));
        }
    }

    // /api/v1/users/songs/search?(name=name||artist=artist)&pageNo=0&sortField=name&direction=asc
    @GetMapping("/songs/search")
    private ResponseEntity<Object> searchUserSongs(@RequestParam Map<String, String> params) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String name = params.get("name") == null ? "" : params.get("name");
            String artist = params.get("artist") == null ? "" : params.get("artist");
            int pageNo = params.get("pageNo") == null ? 0 : Integer.parseInt(params.get("pageNo"));
            int pageSize = 30; // fix pageSize = 20;
            String sortField = params.get("sortField") == null ? "uploadDate" : params.get("sortField");
            String direction = params.get("direction") == null ? "asc" : params.get("direction");
            if (!name.isEmpty()) {
                TransferPageObject data = userService.searchAllUserSongsLikeNameWithSortAndPaging(username, pageNo, pageSize, sortField, direction, name);
                return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!",pageNo, data.totalPage(), data.totalResult(),data.data()));
            }
            if (!artist.isEmpty()) {
                TransferPageObject data = userService.searchAllUserSongsLikeArtistWithSortAndPaging(username, pageNo, pageSize, sortField, direction, artist);
                return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!",pageNo, data.totalPage(), data.totalResult(),data.data()));
            }
            TransferPageObject data = userService.searchAllUserSongsLikeNameWithSortAndPaging(username, pageNo, pageSize, sortField, direction, name);
            return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!",pageNo, data.totalPage(), data.totalResult(),data.data()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }


    @DeleteMapping("/songs/{id}")
    private ResponseEntity<Object> deleteUserSong(@PathVariable("id") Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            SongDto song = userService.deleteSongFromUser(username, id);
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,"Song id: " + song.getId() + " - " + song.getName() + " - " + song.getArtist() + " delete successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(200,"Error"));
        }
    }

    // Allow Sort by Name, Artist, Duration, Size, uploadDate ASC and DESC
    // /api/v1/users/songs/favorites?pageNo=0&sortField=name&direction=desc
    // Can replace with searchAPI name=""
    @GetMapping("/songs/favorites")
    private ResponseEntity<Object> getUserFavorites(@RequestParam(required = false) Map<String, String> qparams) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            int pageNo = qparams.get("pageNo") == null ? 0 : Integer.parseInt(qparams.get("pageNo"));
            int pageSize = 30; // fix pageSize = 20;
            String field = qparams.get("sortField") == null ? "uploadDate" : qparams.get("sortField");
            String direction = qparams.get("direction") == null ? "asc" : qparams.get("direction");
            TransferPageObject data = userService.getAllUserFavoriteSongsWithSortAndPaging(username, pageNo, pageSize, field, direction);
            return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!", pageNo, data.totalPage(),data.totalPage(),data.data()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    // /api/v1/users/songs/favorite/search?name=name&pageNo=0&sortField=name&direction=asc
    @GetMapping("/songs/favorites/search")
    private ResponseEntity<Object> searchUserFavoriteSongs(@RequestParam Map<String, String> params) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String name = params.get("name") == null ? "" : params.get("name");
            String artist = params.get("artist") == null ? "" : params.get("artist");
            int pageNo = Integer.parseInt(params.get("pageNo"));
            int pageSize = 30; // fix pageSize = 20;
            String sortField = params.get("sortField") == null ? "uploadDate" : params.get("sortField");
            String direction = params.get("direction") == null ? "asc" : params.get("direction");
            if (!name.isEmpty()) {
                TransferPageObject data = userService.searchAllUserFavoriteSongsLikeNameWithSortAndPaging(username, pageNo, pageSize, sortField, direction, name);
                return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!", pageNo, data.totalPage(),data.totalPage(),data.data()));
            }
            if (!artist.isEmpty()) {
                TransferPageObject data = userService.searchAllUserFavoriteSongsLikeArtistWithSortAndPaging(username, pageNo, pageSize, sortField, direction, artist);
                return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!", pageNo, data.totalPage(),data.totalPage(),data.data()));
            }
            TransferPageObject data = userService.searchAllUserFavoriteSongsLikeNameWithSortAndPaging(username, pageNo, pageSize, sortField, direction, name);
            return ResponseEntity.status(HttpStatus.OK).body(new PageResponse(200,"Success!", pageNo, data.totalPage(),data.totalPage(),data.data()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @PatchMapping("/songs/favorites/{id}")
    private ResponseEntity<Object> addUserFavorites(@PathVariable("id") Long id, @RequestBody Map<String, Boolean> isFavorite) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            SongDto song = userService.updateUserFavoriteSong(username, id, isFavorite.get("isFavorite"));
            return ResponseEntity.status(HttpStatus.OK).body(new ObjectResponse(200,"Success!", song));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @GetMapping("/songs/stream/{token}/{id}")
    private Mono<ResponseEntity<Resource>> stream(@PathVariable("id") Long id, @PathVariable("token") String token, @RequestHeader(value = "Range", required = false) String rangeHeader) {
        String username = jwtUtility.extractUsername(token);
        Song song = userService.getUserSong(username, id);
        String filePathString = song.getFileUrl();
        FileSystemResource resource = new FileSystemResource(new File(filePathString));

        long fileSize;
        try {
            fileSize = resource.contentLength();
        } catch (IOException e) {
            return Mono.just(new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
        }

        if (rangeHeader == null) {
            return Mono.just(ResponseEntity.ok().contentType(getMediaType(filePathString)).contentLength(fileSize).body(resource));
        }

        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        long rangeStart = Long.parseLong(ranges[0]);
        long rangeEnd = ranges.length > 1 ? Long.parseLong(ranges[1]) : fileSize - 1;
        long contentLength = rangeEnd - rangeStart + 1;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileSize);
        headers.add("Accept-Ranges", "bytes");
        headers.setContentType(getMediaType(filePathString));
        headers.setContentLength(contentLength);

        Mono<Resource> resourceMono = Mono.fromSupplier(() -> {
            try {
                RandomAccessFile file = new RandomAccessFile(filePathString, "r");
                file.seek(rangeStart);
                byte[] data = new byte[(int) contentLength];
                file.readFully(data);
                file.close();
                return new ByteArrayResource(data);
            } catch (IOException e) {
                return null;
            }
        });

        return resourceMono.map(resourceBody -> ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).headers(headers).body(resourceBody));
    }

    private MediaType getMediaType(String filePath) {
        String extension = FilenameUtils.getExtension(filePath);
        return switch (extension) {
            case "mp3" -> MediaType.valueOf("audio/mp3");
            case "flac" -> MediaType.valueOf("audio/x-flac");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }

    @GetMapping("/songs/download/{id}")
    private ResponseEntity<Object> downloadUserSong(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Song song = userService.getUserSong(username, id);
            File file = new File(song.getFileUrl());
            String subtype = FilenameUtils.getExtension(file.getName()).equals("flac") ? "x-flac" : "mp3";
            return ResponseEntity.status(HttpStatus.OK).header("Content-Disposition", "attachment; filename=\"" + song.getFileName() + "\"").contentType(new MediaType("audio", subtype)) // FLAC - MP3
                    .contentLength(file.length()).body(new InputStreamResource(new FileInputStream(file)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @PostMapping("/songs/upload/multi")
    private ResponseEntity<Object> uploadUserSongs(@RequestParam("files") MultipartFile[] files) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            List<SongDto> result = userService.addSongsToUser(username, files);
            return ResponseEntity.status(HttpStatus.CREATED).body(new ListResponse(201,"Success!",result.size(),result));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @GetMapping("/lists")
    private ResponseEntity<Object> getAllUserCustomLists() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            List<SongListDto> songListDto = userService.getAllUserCustomLists(username);
            return ResponseEntity.status(HttpStatus.OK).body(new ListResponse(200,"Success!", songListDto.size(), songListDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @PostMapping("/lists")
    private ResponseEntity<Object> createUserList(@RequestBody Map<String, String> listName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            userService.createUserCustomList(username, listName.get("name"));
            return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse(201,"Playlist " + listName.get("name") + " created successfully!"));
        } catch(InvalidInputException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @GetMapping("/lists/{id}")
    private ResponseEntity<Object> getUserCustomList(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            SongList songList = userService.getUserCustomList(username, id);
            List<SongDto> songDtos = new ArrayList<>();
            for (Song songs : songList.getSongs()) {
                songDtos.add(SongMapper.mapToSongDto(songs));
            }
            return ResponseEntity.status(HttpStatus.OK).body(new ListResponse(200,"Success!",songDtos.size(), songDtos));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @DeleteMapping("/lists/{id}")
    private ResponseEntity<Object> deleteUserCustomList(@PathVariable Long id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            SongList songList = userService.deleteUserCustomList(username, id);
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,"Deleted playlist " + songList.getName() + " successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @PatchMapping("/lists/{id}")
    private ResponseEntity<Object> updateSongList(@PathVariable Long id, @RequestBody Map<String, String> listName) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            SongList songList = userService.updateUserCustomList(username, id, listName.get("name"));
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,"Playlist name updated to " + songList.getName() + " successfully!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    //Look not so good
    @PostMapping("/lists/{id}/songs/{songId}")
    private ResponseEntity<Object> addSongToCustomList(@PathVariable Long id, @PathVariable Long songId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String message = userService.addSongToCustomList(username, id, songId);
            return ResponseEntity.status(HttpStatus.CREATED).body(new BaseResponse(200,message));
        } catch (InvalidInputException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,e.getMessage()));
        }
    }

    @DeleteMapping("/lists/{id}/songs/{songId}")
    private ResponseEntity<Object> removeSongFromCustomList(@PathVariable Long id, @PathVariable Long songId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            String message = userService.removeSongFromCustomList(username, id, songId);
            return ResponseEntity.status(HttpStatus.OK).body(new BaseResponse(200,message));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Error"));
        }
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> maxUploadSizeExceeded(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BaseResponse(400,"Files size exceeded 200MB"));
    }
}
