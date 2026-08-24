.PHONY: build check test lint run clean help

help:
	@echo "Available targets:"
	@echo "  build      - Build all crates (debug)"
	@echo "  release    - Build all crates (release)"
	@echo "  check      - Type-check without generating binaries"
	@echo "  test       - Run all tests"
	@echo "  lint       - Run clippy and fmt"
	@echo "  fmt        - Format code"
	@echo "  clippy     - Run clippy"
	@echo "  run        - Start dev server"
	@echo "  migrate    - Run database migrations"
	@echo "  clean      - Clean build artifacts"
	@echo "  admin-dev  - Start admin frontend dev server"
	@echo "  admin-build- Build admin frontend"

build:
	cargo build --workspace

release:
	cargo build --release --workspace

check:
	cargo check --workspace

test:
	cargo test --workspace

lint: fmt clippy

fmt:
	cargo fmt --all

clippy:
	cargo clippy --workspace -- -D warnings

run:
	RUST_LOG=debug cargo run -p redhub-server

migrate:
	cargo run -p migration -- up

clean:
	cargo clean
	rm -rf admin/node_modules admin/dist

admin-dev:
	cd admin && npm run dev

admin-build:
	cd admin && npm run build
