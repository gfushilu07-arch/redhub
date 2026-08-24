pub use sea_orm_migration::prelude::*;

mod m20260824_000001_create_platform_tables;
mod m20260824_000002_create_party_tables;
mod m20260824_000003_create_learning_tables;
mod m20260824_000004_create_service_tables;
mod m20260824_000005_create_grid_tables;
mod m20260824_000006_create_shared_tables;
mod m20260824_000007_create_workflow_tables;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260824_000001_create_platform_tables::Migration),
            Box::new(m20260824_000002_create_party_tables::Migration),
            Box::new(m20260824_000003_create_learning_tables::Migration),
            Box::new(m20260824_000004_create_service_tables::Migration),
            Box::new(m20260824_000005_create_grid_tables::Migration),
            Box::new(m20260824_000006_create_shared_tables::Migration),
            Box::new(m20260824_000007_create_workflow_tables::Migration),
        ]
    }
}
