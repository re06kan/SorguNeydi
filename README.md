# SorguNeydi

![Image](https://github.com/user-attachments/assets/91688456-7754-4c84-8782-84fcfc953d5b)

<p align="center">
  <strong>Güçlü, Görsel ve Kullanımı Kolay Veritabanı Sorgu Aracı</strong>
</p>

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Desteklenen Veritabanları](#-desteklenen-veritabanları)
- [Teknolojik Altyapı](#-teknolojik-altyapı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Katkıda Bulunma](#-katkıda-bulunma)
- [Lisans](#-lisans)

## 🚀 Proje Hakkında

**SorguNeydi**, veritabanı yöneticileri, geliştiriciler ve veri analistleri için tasarlanmış modern bir veritabanı sorgu ve yönetim aracıdır. SQL kodlarını manuel yazmak yerine, kullanıcı dostu ve sezgisel bir arayüz ile veritabanı sorgularınızı oluşturabilir, çalıştırabilir ve yönetebilirsiniz.

SorguNeydi, farklı veritabanı sistemlerine tek bir arayüzden erişim sağlayarak, veritabanı yönetimini basitleştirir ve veritabanları arasında geçişi kolaylaştırır.

## ✨ Özellikler

### Temel Özellikler

- **Veritabanı Bağlantı Yönetimi**
  - Farklı veritabanlarına bağlanma ve test etme
  - Bağlantıları kaydetme, düzenleme ve listeleme

- **SQL Sorgu Çalıştırma**
  - Manuel SQL sorguları yazma ve çalıştırma
  - Sorgu sonuçlarını tablo formatında görüntüleme
  - Hata yönetimi ve loglama

- **Veritabanı Şema Görüntüleme**
  - Tabloları listeleme
  - Tablo yapısını (sütunlar, veri tipleri) görüntüleme
  - Şema bilgilerini ağaç yapısında gösterme

- **Görsel Sorgu Oluşturucu**
  - Tablolardan sütun seçme (SELECT)
  - Tablo birleştirme işlemleri (JOIN)
  - Filtreleme koşulları ekleme (WHERE)
  - Sıralama kriterleri belirleme (ORDER BY)
  - Gruplama işlemleri yapma (GROUP BY)

### İleri Düzey Özellikler

- **JOIN İşlemleri**
  - INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN desteği
  - JOIN koşullarını görsel olarak oluşturma

- **Gruplama ve Sıralama**
  - Tablolardan sütun seçerek GROUP BY oluşturma
  - Artan (ASC) ve azalan (DESC) sıralama seçenekleri
  - Aktif gruplama ve sıralama kriterlerini gösterme

- **Filtre ve Koşullar**
  - WHERE koşulları oluşturma
  - Farklı operatörler ile filtre ekleme (=, >, <, LIKE, vb.)

- **Kullanıcı Arayüzü**
  - Çoklu sekme ile farklı sorgu özelliklerine erişim
  - Sürükle-bırak etkileşimleri
  - Modern ve kullanıcı dostu arayüz (Material UI)

## 💾 Desteklenen Veritabanları

SorguNeydi aşağıdaki veritabanı sistemlerini desteklemektedir:

- **MySQL/MariaDB**
- **PostgreSQL**
- **Microsoft SQL Server**
- **Oracle Database**
- **SQLite**
- **MongoDB**

## 🔧 Teknolojik Altyapı

### Backend
- **Node.js** ve **Express.js** - Ana sunucu yapısı
- **mysql2**, **pg**, **mssql**, **sqlite3**, **mongodb** - Veritabanı bağlantı sürücüleri
- **dotenv** - Ortam değişkenleri yönetimi
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - Kullanıcı arayüzü kütüphanesi
- **Material UI** - UI bileşenleri ve tema sistemi
- **React Router** - Sayfa yönlendirme
- **Axios** - HTTP istekleri
- **React Query** - Veri yönetimi
- **React Syntax Highlighter** - SQL sözdizimi vurgulama

## 📦 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- Desteklenen veritabanlarından en az biri

### Adımlar

1. Depoyu klonlayın:
```bash
git clone https://github.com/kullaniciadi/SorguNeydi.git
cd SorguNeydi
```

2. Bağımlılıkları yükleyin:
```bash
# Backend bağımlılıkları
cd server
npm install

# Frontend bağımlılıkları
cd ../client
npm install
```

3. Çevre değişkenlerini ayarlayın:
```bash
# server klasöründe .env dosyası oluşturun
cd ../server
cp .env.example .env
```

4. Uygulamayı başlatın:
```bash
# Backend sunucusunu başlatın
npm run dev

# Yeni bir terminal açın ve frontend'i başlatın
cd ../client
npm start
```

5. Tarayıcınızı açın ve şu adrese gidin: `http://localhost:3000`

## 🖥️ Kullanım

1. **Veritabanı Bağlantısı Oluşturma**:
   - Ana sayfadan "Yeni Bağlantı" düğmesine tıklayın
   - Veritabanı türünü seçin ve bağlantı bilgilerini girin
   - Bağlantıyı test edin ve kaydedin

2. **Sorgu Çalıştırma**:
   - Bağlantı listesinden bir veritabanı bağlantısı seçin
   - SQL sorgunuzu yazın veya görsel sorgu oluşturucuyu kullanın
   - "Çalıştır" düğmesine tıklayın ve sonuçları görüntüleyin

3. **Şema Görüntüleme**:
   - Sol paneldeki ağaç yapısını kullanarak veritabanı şemasını keşfedin
   - Tablolara tıklayarak sütun yapılarını görüntüleyin

4. **Görsel Sorgu Oluşturma**:
   - "Görsel Sorgu" sekmesine geçin
   - Tablolar panelinden sorguda kullanmak istediğiniz tabloları seçin
   - Sütunları seçin, join işlemleri ekleyin, filtreler belirleyin
   - Otomatik oluşturulan SQL kodunu görüntüleyin ve çalıştırın

## 📸 Ekran Görüntüleri

![Ana Ekran](./docs/images/main-screen.png)
*Ana ekran ve bağlantı yönetimi*

![Görsel Sorgu Oluşturucu](./docs/images/query-builder.png)
*Görsel sorgu oluşturma arayüzü*

![Sorgu Sonuçları](./docs/images/query-results.png)
*Sorgu sonuçları görüntüleme*

## 🤝 Katkıda Bulunma

SorguNeydi projesine katkıda bulunmak isterseniz:

1. Bu depoyu forklayın
2. Özellik dalınızı oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Dalınıza push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
