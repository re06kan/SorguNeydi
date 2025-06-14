# SorguNeydi

![Image](https://github.com/user-attachments/assets/91688456-7754-4c84-8782-84fcfc953d5b)

<p align="center">
  <strong>Güçlü, Görsel ve Kullanımı Kolay Veritabanı Sorgu Aracı</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.0-blue" alt="Version 1.1.0" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT" />
</p>

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Desteklenen Veritabanları](#-desteklenen-veritabanları)
- [Teknolojik Altyapı](#-teknolojik-altyapı)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Sürüm Notları](#-sürüm-notları)
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
  - Tek tıkla sorgu ve sonuçları temizleme

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
  - SQL fonksiyonları (COUNT, SUM, AVG, vb.)

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

- **SQL Fonksiyonları**
  - Toplama fonksiyonları (COUNT, SUM, AVG, MIN, MAX)
  - Metin işleme fonksiyonları (CONCAT, SUBSTRING, vb.)
  - Tarih işleme fonksiyonları
  - Koşullu ifadeler (CASE WHEN)

- **Kullanıcı Arayüzü**
  - Çoklu sekme ile farklı sorgu özelliklerine erişim
  - Sürükle-bırak etkileşimleri
  - Responsive tasarım (mobil uyumluluk)
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

## 📦 Kurulum ve Başlatma

### İlk Kurulum

Projeyi ilk kez kurarken tüm bağımlılıkları yüklemek için:

```bash
# Ana dizinde
npm run install-all
```

Bu komut, ana proje, server ve client için tüm gerekli bağımlılıkları otomatik olarak yükleyecektir.

### Veritabanı Kurulumu

PostgreSQL veritabanını yapılandırın:

1. PostgreSQL'i yükleyin ve çalıştırın
2. `sorguneydi` adında yeni bir veritabanı oluşturun
3. Server klasöründeki `.env` dosyasında veritabanı bağlantı bilgilerini düzenleyin (veya server/config/db.js dosyasındaki ayarları güncelleyin)

### Geliştirme Modunda Çalıştırma

Hem backend hem frontend'i geliştirme modunda eş zamanlı çalıştırmak için:

```bash
# Ana dizinde
npm run dev
```

Bu komut:
- Backend'i `http://localhost:5001` adresinde
- Frontend'i `http://localhost:3000` adresinde başlatacaktır

### Yalnızca Backend'i Çalıştırma

```bash
# Ana dizinde
npm run server

# VEYA server klasöründe
cd server
npm run dev
```

### Yalnızca Frontend'i Çalıştırma

```bash
# Ana dizinde
npm run client

# VEYA client klasöründe
cd client
npm start
```

### Prodüksiyon için Build

```bash
# Client build
cd client
npm run build

# Tüm uygulamayı çalıştırma (backend + frontend build)
cd ..
npm start
```

## 🖥️ Kullanım

1. **Veritabanı Bağlantısı Oluşturma**:
   - Ana sayfadan "Yeni Bağlantı" düğmesine tıklayın
   - Veritabanı türünü seçin ve bağlantı bilgilerini girin
   - Bağlantıyı test edin ve kaydedin

2. **Sorgu Çalıştırma**:
   - Bağlantı listesinden bir veritabanı bağlantısı seçin
   - SQL sorgunuzu yazın veya görsel sorgu oluşturucuyu kullanın
   - "Çalıştır" düğmesine tıklayın ve sonuçları görüntüleyin
   - İstenirse "Temizle" düğmesi ile sorgu ve sonuçları temizleyin

3. **Şema Görüntüleme**:
   - Sol paneldeki ağaç yapısını kullanarak veritabanı şemasını keşfedin
   - Tablolara tıklayarak sütun yapılarını görüntüleyin

4. **Görsel Sorgu Oluşturma**:
   - "Görsel Sorgu" sekmesine geçin
   - Tablolar panelinden sorguda kullanmak istediğiniz tabloları seçin
   - Sütunları seçin, join işlemleri ekleyin, filtreler belirleyin
   - Otomatik oluşturulan SQL kodunu görüntüleyin ve çalıştırın

## 📝 Sürüm Notları

### Versiyon 1.1.0 (Güncel)
- SQL Fonksiyonları eklendi (COUNT, SUM, AVG, MIN, MAX, vb.)
- Responsive tasarım iyileştirmeleri yapıldı
- Sorgu temizleme butonu eklendi
- Arayüz boşlukları optimize edildi
- WHERE filtreleme tamamlandı

### Versiyon 1.0.0
- İlk kararlı sürüm
- PostgreSQL ve MySQL desteği
- Temel sorgu oluşturma özellikleri
- Bağlantı yönetimi
- Görsel JOIN, ORDER BY, GROUP BY desteği

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
