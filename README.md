# blog-crudAPI
In this blog service i used node express js to provide server-side API endpoints that performs CRUD services where Users can be created and also they can create post contents and also upload files.
tools used were sequelize orm, postgres db, render platform as a service for deployment with relational database provided(postgres), cloudinary for file and media management,
multer middleware to handle the uploaded file before it is saved to cloudinary.

ENDPOINTS = [user, post]
URL = https://blo-image-api.onrender.com

USER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Add new user:
POST: https://blo-image-api.onrender.com/api/v1/user/new
User successfully Created:
{"id":5,"username":"test_aylo",
"email":"testaylo2023@yahoo.com",
"password":"test-pass","updatedAt":"2023-07-31T00:51:35.931Z",
"createdAt":"2023-07-31T00:51:35.931Z"}

//Get All Users :
GET: https://blo-image-api.onrender.com/api/v1/user
{
        "id": 5,
        "username": "test_aylo",
        "email": "testaylo2023@yahoo.com",
        "createdAt": "2023-07-31T00:51:35.931Z",
        "updatedAt": "2023-07-31T00:51:35.931Z"
    },
    {
        "id": 6,
        "username": "test_2_aylo",
        "email": "test_2_aylo2023@yahoo.com",
        "createdAt": "2023-07-31T01:07:23.211Z",
        "updatedAt": "2023-07-31T01:07:23.211Z"
    },
    {
        "id": 7,
        "username": "aylo",
        "email": "aylo2023@yahoo.com",
        "createdAt": "2023-07-31T01:08:09.621Z",
        "updatedAt": "2023-07-31T01:08:09.621Z"
    },
    {
        "id": 8,
        "username": "test-user",
        "email": "test-mail@yahoo.com",
        "createdAt": "2023-07-31T01:08:48.477Z",
        "updatedAt": "2023-07-31T01:08:48.477Z"
    }

    //Get User By Id:
    GET: https://blo-image-api.onrender.com/api/v1/user/8
       {
        "id": 8,
        "username": "test-user",
        "email": "test-mail@yahoo.com",
        "createdAt": "2023-07-31T01:08:48.477Z",
        "updatedAt": "2023-07-31T01:08:48.477Z"
    }

    //Update User:
    PATCH: https://blo-image-api.onrender.com/api/v1/user/update/:id

    //Delete User:
    DELETE: https://blo-image-api.onrender.com/api/v1/user/:id

    POST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    //Add new Post:
    POST: https://blo-image-api.onrender.com/api/v1/post/new
    Detail: post successfully created,
    {"id":1,"title":"test-title",
    "content":"test-content","tags":["test-tag"],
    "userId":2,"file":"https://res.cloudinary.com/dq0f0rn6t/image/upload/v1690766679/1690766679307_esico-icon.png",
    "updatedAt":"2023-07-31T01:24:40.225Z","createdAt":"2023-07-31T01:24:40.225Z"}

  //Get All Posts:
    GET: https://blo-image-api.onrender.com/api/v1/post
    {
        "id": 1,
        "title": "test-title",
        "content": "test-content",
        "file": "https://res.cloudinary.com/dq0f0rn6t/image/upload/v1690766679/1690766679307_esico-icon.png",
        "tags": [
            "test-tag"
        ],
        "createdAt": "2023-07-31T01:24:40.225Z",
        "updatedAt": "2023-07-31T01:24:40.225Z",
        "userId": 2
    },
    {
        "id": 2,
        "title": "test-title-2",
        "content": "test-content-2",
        "file": "https://res.cloudinary.com/dq0f0rn6t/image/upload/v1690766828/1690766827340_photo_2023-02-16_18-11-34.jpg",
        "tags": [
            "test-tag2"
        ],
        "createdAt": "2023-07-31T01:27:08.590Z",
        "updatedAt": "2023-07-31T01:27:08.590Z",
        "userId": 2
    },
    {
        "id": 3,
        "title": "title-2",
        "content": "test-content-2",
        "file": "https://res.cloudinary.com/dq0f0rn6t/image/upload/v1690766999/1690766998171_photo_2023-02-16_18-11-34.jpg",
        "tags": [
            "ag2t"
        ],
        "createdAt": "2023-07-31T01:30:02.980Z",
        "updatedAt": "2023-07-31T01:30:02.980Z",
        "userId": 2
    },

    //Get Post By Id:
    GET: https://blo-image-api.onrender.com/api/v1/post/1
    {
        "id": 1,
        "title": "test-title",
        "content": "test-content",
        "file": "https://res.cloudinary.com/dq0f0rn6t/image/upload/v1690766679/1690766679307_esico-icon.png",
        "tags": [
            "test-tag"
        ],
        "createdAt": "2023-07-31T01:24:40.225Z",
        "updatedAt": "2023-07-31T01:24:40.225Z",
        "userId": 2
    }

    //Update Post By Id:
    PATCH: https://blo-image-api.onrender.com/api/v1/post/update/:id

    //Delete Post By Id:
    DELETE: https://blo-image-api.onrender.com/api/v1/post/:id

    //Get Post By Post Title:
    GET: https://blo-image-api.onrender.com/api/v1/post/get-by-title
    request payload : {"title":"test-title-2"}

    //Get All Posts By User Id:
    POST: https://blo-image-api.onrender.com/api/v1/post/get-by-userid
    request payload : {"userId":2}

  
    
