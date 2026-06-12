// use serde::{Deserialize, Serialize};
// use uuid::Uuid;

// #[derive(Serialize, Deserialize)]
// pub struct TodoPayload {
//     pub name: String,

// }

// #[derive(Serialize, Deserialize)]
// pub struct Todo {
//     pub id: Uuid,
//     pub name: String,
//     pub status: Status,
// }

// pub enum Status {
//     Started,
//     Completed,
//     InvalidEntry

// }

// impl Status {
//     pub fn map_id_to_status(&self, x: u8) -> Self {
//         match x {
//             1 => Status::Started,
//             2 => Status::Completed,
//             _ => Status::InvalidEntry
//         }
//     }
// }
