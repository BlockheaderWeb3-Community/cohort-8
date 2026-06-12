use crate::handlers::{root::root, user_handler::create_user};
use axum::{
    Router,
    routing::{get, post},
};
pub async fn axum_router() -> Router {
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `POST /users` goes to `create_user`
        .route("/users", post(create_user));
    app
}
