#!/bin/bash
# Script untuk push ke GitHub - School Guard Manager
# Untuk dijalankan di Git Bash

echo "🚀 Push ke GitHub - School Guard Manager"
echo "========================================"

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo -e "${YELLOW}📋 Cek status repository...${NC}"
git status --short

echo ""
echo -e "${YELLOW}🔗 Setup remote repository...${NC}"
REPO_URL="https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git"

# Cek apakah remote sudah ada
if git remote get-url origin >/dev/null 2>&1; then
    echo -e "${CYAN}Remote origin sudah ada, update URL...${NC}"
    git remote set-url origin $REPO_URL
else
    echo -e "${CYAN}Tambah remote origin...${NC}"
    git remote add origin $REPO_URL
fi

echo -e "${GREEN}✅ Remote URL: $REPO_URL${NC}"

echo ""
echo -e "${YELLOW}📝 Set branch ke main...${NC}"
git branch -M main

echo ""
echo -e "${YELLOW}📤 Push ke GitHub...${NC}"
echo -e "${CYAN}Jika diminta authentication:${NC}"
echo -e "${CYAN}Username: wawan-yogaswara${NC}"
echo -e "${CYAN}Password: [Personal Access Token]${NC}"
echo ""

# Push ke GitHub
if git push -u origin main; then
    echo ""
    echo -e "${GREEN}🎉 Push berhasil!${NC}"
    echo -e "${GREEN}Repository: https://github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah${NC}"
    echo ""
    echo -e "${YELLOW}🎯 Next Steps:${NC}"
    echo "1. Verifikasi di GitHub"
    echo "2. Setup repository description dan topics"
    echo "3. Setup Supabase project"
    echo "4. Deploy ke production"
else
    echo ""
    echo -e "${RED}❌ Push gagal!${NC}"
    echo ""
    echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
    echo "1. Buat Personal Access Token di GitHub:"
    echo "   https://github.com/settings/tokens/new"
    echo "2. Gunakan token sebagai password"
    echo "3. Atau update URL dengan token:"
    echo "   git remote set-url origin https://TOKEN@github.com/wawan-yogaswara/sistem-informasi-pengawas-sekolah.git"
fi

echo ""
echo -e "${GREEN}Selesai!${NC}"