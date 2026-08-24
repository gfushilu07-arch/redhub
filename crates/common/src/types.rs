use serde::{Deserialize, Serialize};


/// Pagination request parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageReq {
    pub page: u64,
    pub page_size: u64,
    #[serde(default = "default_sort_by")]
    pub sort_by: String,
    #[serde(default = "default_sort_order")]
    pub sort_order: String,
}

fn default_sort_by() -> String { "created_at".to_string() }
fn default_sort_order() -> String { "desc".to_string() }

/// Paginated response wrapper
#[derive(Debug, Serialize, Deserialize)]
pub struct Page<T> {
    pub list: Vec<T>,
    pub total: u64,
    pub page: u64,
    pub page_size: u64,
}

/// Standard API response envelope
#[derive(Debug, Serialize)]
pub struct ApiResponse<T: serde::Serialize> {
    pub code: i32,
    pub message: String,
    pub data: Option<T>,
}
