mod handlers;
mod routes;
mod schema;

const PORT: &str = "0.0.0.0:4440";

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();

    let app = routes::axum_router().await;
    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind(PORT).await.unwrap();

    tracing::info!("server running on {PORT}");
    axum::serve(listener, app).await.unwrap();
}
