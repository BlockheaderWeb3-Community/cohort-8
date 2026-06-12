use crate::schema::users::{CreateUserPayload, User};

use axum::{Json, http::StatusCode};
pub async fn create_todo(
    // this argument tells axum to parse the request body
    // as JSON into a `CreateUserPayload` type
    Json(payload): Json<CreateUserPayload>,
) -> (StatusCode, Json<User>) {
    // insert your application logic here
    let user = User {
        id: 1337,
        username: payload.username,
        age: payload.age,
    };

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    (StatusCode::CREATED, Json(user))
}
