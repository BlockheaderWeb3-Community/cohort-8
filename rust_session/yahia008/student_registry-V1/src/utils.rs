pub find_id(&self, id:u8)-> Option<&self> {
     self.students.iter().find(|u| u.id == id)
}