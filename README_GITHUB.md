# 🏫 School Guard Manager

Sistem manajemen pengawasan sekolah berbasis web untuk memantau aktivitas dan supervisi di lingkungan pendidikan.

## ✨ Fitur Utama

- 📊 **Dashboard Analytics** - Statistik dan laporan real-time
- 👥 **Manajemen User** - Kelola pengawas dan admin
- 🏫 **Data Sekolah** - Informasi lengkap sekolah binaan
- 📋 **Supervisi** - Pencatatan dan monitoring supervisi
- 📝 **Laporan** - Generate laporan PDF dengan foto
- 📱 **Responsive Design** - Akses dari desktop dan mobile
- 🔐 **Authentication** - Login aman dengan Supabase
- 📸 **Upload Foto** - Dokumentasi aktivitas dengan foto

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)

### Installation

1. **Clone repository**
```bash
git clone https://github.com/your-username/school-guard-manager.git
cd school-guard-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env dengan credentials Supabase Anda
```

4. **Setup database**
- Buat project baru di [Supabase](https://supabase.com)
- Copy SQL schema dari `supabase-schema-setup.sql`
- Execute di Supabase SQL Editor

5. **Run development server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Query** - Data fetching
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Supabase** - Database & Auth
- **Multer** - File upload
- **CORS** - Cross-origin requests

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security** - Data protection
- **Real-time subscriptions** - Live updates

## 📁 Project Structure

```
school-guard-manager/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities & config
│   │   └── hooks/         # Custom hooks
│   └── public/            # Static assets
├── server/                # Backend Express app
│   ├── routes.ts          # API routes
│   ├── storage.ts         # File handling
│   └── index.ts           # Server entry
├── api/                   # Serverless functions
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

## 🔧 Configuration

### Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

1. Buka Supabase Dashboard > SQL Editor
2. Copy paste isi file `supabase-schema-setup.sql`
3. Execute untuk membuat tables dan policies

## 📱 Usage

### Login
- Admin: Akses penuh ke semua fitur
- Pengawas: Akses terbatas sesuai sekolah binaan

### Dashboard
- Lihat statistik aktivitas
- Monitor supervisi terbaru
- Akses quick actions

### Manajemen Data
- **Sekolah**: Tambah/edit data sekolah
- **User**: Kelola pengawas dan admin
- **Supervisi**: Catat hasil supervisi
- **Laporan**: Generate PDF dengan foto

## 🚀 Deployment

### Netlify (Recommended)
```bash
npm run build
# Upload dist/ folder ke Netlify
# Set environment variables di Netlify dashboard
```

### Vercel
```bash
npm install -g vercel
vercel --prod
# Set environment variables di Vercel dashboard
```

### Manual
```bash
npm run build
# Deploy dist/ folder ke hosting pilihan Anda
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Database Migration
```bash
# Migrate dari localStorage ke Supabase
node scripts/migrate-to-supabase.js

# Setup project Supabase baru
node update-config-project-baru.js
```

## 📚 Documentation

- [Setup Guide](CARA_GUNAKAN_UPDATE_CONFIG_PROJECT_BARU.md)
- [API Documentation](API_DOCUMENTATION.md)
- [Deployment Guide](PANDUAN_DEPLOY_PRODUCTION.md)
- [Troubleshooting](TROUBLESHOOTING.md)

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) - Backend as a Service
- [Shadcn/ui](https://ui.shadcn.com) - UI Components
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [React](https://reactjs.org) - Frontend Framework

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek [Documentation](docs/)
2. Buka [Issues](https://github.com/your-username/school-guard-manager/issues)
3. Hubungi maintainer

---

**🎯 Built with ❤️ for Indonesian Education System**