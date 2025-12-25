#!/bin/bash

# ChargerBNB - Unified Deployment Script
# This script handles all deployment operations

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Display menu
show_menu() {
    echo "================================"
    echo "  ChargerBNB Deployment Menu"
    echo "================================"
    echo "1) Start Local Development"
    echo "2) Stop Local Services"
    echo "3) Build Frontend"
    echo "4) Build Backend"
    echo "5) Deploy Frontend (Netlify)"
    echo "6) Deploy Backend (Render)"
    echo "7) Full Deployment (Frontend + Backend)"
    echo "8) Run Tests"
    echo "9) Git Push to GitHub"
    echo "0) Exit"
    echo "================================"
}

# Start local development
start_local() {
    print_info "Starting local development environment..."
    
    # Check prerequisites
    if ! command_exists node; then
        print_error "Node.js not found. Please install Node.js 18+"
        exit 1
    fi
    
    # Start backend
    print_info "Starting backend on port 5000..."
    cd backend
    if [ ! -f ".env" ]; then
        print_error "Backend .env not found. Copy .env.example to .env"
        exit 1
    fi
    npm install
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    print_info "Starting frontend on port 3000..."
    cd frontend-react
    if [ ! -f ".env" ]; then
        print_error "Frontend .env not found. Copy .env.example to .env"
        exit 1
    fi
    npm install
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Local development started!"
    print_info "Backend PID: $BACKEND_PID"
    print_info "Frontend PID: $FRONTEND_PID"
    print_info "Frontend: http://localhost:3000"
    print_info "Backend: http://localhost:5000"
    print_info "Press Ctrl+C to stop"
    
    # Wait for processes
    wait
}

# Stop local services
stop_local() {
    print_info "Stopping local services..."
    pkill -f "node.*backend" || true
    pkill -f "react-scripts start" || true
    print_success "Services stopped"
}

# Build frontend
build_frontend() {
    print_info "Building frontend..."
    cd frontend-react
    npm install
    npm run build
    cd ..
    print_success "Frontend built successfully in frontend-react/build/"
}

# Build backend
build_backend() {
    print_info "Building backend..."
    cd backend
    npm install
    npm run build
    cd ..
    print_success "Backend built successfully in backend/dist/"
}

# Deploy frontend to Netlify
deploy_frontend() {
    print_info "Deploying frontend to Netlify..."
    
    if ! command_exists netlify; then
        print_error "Netlify CLI not found. Install with: npm install -g netlify-cli"
        exit 1
    fi
    
    cd frontend-react
    
    # Build if not already built
    if [ ! -d "build" ]; then
        print_info "Building frontend first..."
        npm run build
    fi
    
    print_info "Deploying to production..."
    netlify deploy --prod --dir=build
    
    cd ..
    print_success "Frontend deployed to Netlify!"
}

# Deploy backend to Render
deploy_backend() {
    print_info "Deploying backend to Render..."
    print_info "Pushing to GitHub to trigger Render auto-deploy..."
    
    git add .
    git commit -m "deploy: Backend deployment $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main
    
    print_success "Pushed to GitHub - Render will auto-deploy"
    print_info "Check status at: https://dashboard.render.com"
}

# Full deployment
full_deploy() {
    print_info "Starting full deployment..."
    
    # Build both
    build_frontend
    build_backend
    
    # Deploy both
    deploy_frontend
    deploy_backend
    
    print_success "Full deployment complete!"
    print_info "Frontend: https://chargerbnb-ev.netlify.app"
    print_info "Backend: https://chargerbnb-fullstack.onrender.com"
}

# Run tests
run_tests() {
    print_info "Running tests..."
    
    # Backend tests
    print_info "Testing backend..."
    cd backend
    npm test || print_error "Backend tests failed (or no tests configured)"
    cd ..
    
    # Frontend tests
    print_info "Testing frontend..."
    cd frontend-react
    npm test -- --watchAll=false || print_error "Frontend tests failed (or no tests configured)"
    cd ..
    
    print_success "Tests completed"
}

# Git push
git_push() {
    print_info "Pushing to GitHub..."
    
    git status
    echo ""
    read -p "Commit message: " commit_msg
    
    if [ -z "$commit_msg" ]; then
        commit_msg="update: Code changes $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    git add .
    git commit -m "$commit_msg"
    git push origin main
    
    print_success "Pushed to GitHub"
}

# Main menu loop
main() {
    while true; do
        show_menu
        read -p "Select option (0-9): " choice
        
        case $choice in
            1) start_local ;;
            2) stop_local ;;
            3) build_frontend ;;
            4) build_backend ;;
            5) deploy_frontend ;;
            6) deploy_backend ;;
            7) full_deploy ;;
            8) run_tests ;;
            9) git_push ;;
            0) print_info "Goodbye!"; exit 0 ;;
            *) print_error "Invalid option" ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Run main
main
