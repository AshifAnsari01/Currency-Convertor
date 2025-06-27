# 💱 Advanced Currency Converter

A feature-rich, modern currency converter built with React that supports real-time exchange rates, historical charts, and multiple advanced features.

![Currency Converter Demo](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![API](https://img.shields.io/badge/API-ExchangeRate.host-orange?style=for-the-badge)

## ✨ Features

### 🎯 Core Features
- **Real-time Conversion**: Convert between 160+ currencies using live exchange rates
- **Currency Flags**: Visual country flags for each currency in dropdowns
- **Historical Charts**: 7-day exchange rate trends with interactive charts
- **Multi-Currency Table**: View top 10 currency rates at once

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Keyboard Shortcuts**: 
  - `Enter` = Convert
  - `Ctrl + S` = Swap currencies
- **Loading States**: Visual feedback during API calls
- **Error Handling**: Graceful error messages and offline detection

### 💾 Data Management
- **LocalStorage**: Saves last used currencies and amounts
- **Auto-refresh**: Real-time data updates
- **Offline Support**: Detects when user is offline

### 📊 Advanced Features
- **Interactive Charts**: Built with Recharts for smooth data visualization
- **Searchable Dropdowns**: Find currencies quickly with react-select
- **Currency Swap**: One-click currency swapping
- **Rate Display**: Shows current exchange rate alongside conversion

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.vercel.app)

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Styling**: CSS3 with CSS Variables
- **Charts**: Recharts
- **Dropdowns**: React Select
- **API**: ExchangeRate.host
- **Deployment**: Vercel/Netlify ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/currency-converter.git
   cd currency-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run deploy
```

## 📱 Features in Detail

### 1. Real-time Currency Conversion
- Fetches live rates from ExchangeRate.host API
- Supports 160+ world currencies
- Instant conversion with real-time updates

### 2. Historical Data Charts
- 7-day exchange rate trends
- Interactive line charts with tooltips
- Responsive chart design

### 3. Currency Flags
- Country flags for each currency
- Uses flagsapi.com for high-quality flag images
- Visual currency identification

### 4. Dark Mode
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions

### 5. Multi-Currency Table
- View top 10 currency rates simultaneously
- Sortable by exchange rate
- Compact table design

### 6. Keyboard Shortcuts
- `Enter`: Perform conversion
- `Ctrl + S`: Swap selected currencies
- Enhanced user experience

### 7. LocalStorage Integration
- Remembers last used currencies
- Saves amount and preferences
- Persistent across browser sessions

### 8. Error Handling
- Network error detection
- Offline state handling
- User-friendly error messages

## 🎨 Customization

### Adding New Currencies
The app automatically fetches all available currencies from the API. No manual configuration needed.

### Styling
Modify CSS variables in `src/index.css`:
```css
:root {
  --primary-color: #007bff;
  --background-light: #f2f3f5;
  --background-dark: #1a1a1a;
  /* ... more variables */
}
```

### API Configuration
The app uses ExchangeRate.host API. To use a different API:
1. Update API endpoints in `App.js`
2. Modify data parsing logic
3. Update error handling

## 📊 API Endpoints Used

- `https://api.exchangerate.host/symbols` - Get all currencies
- `https://api.exchangerate.host/convert` - Convert currencies
- `https://api.exchangerate.host/timeseries` - Historical data
- `https://api.exchangerate.host/latest` - Latest rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ExchangeRate.host](https://exchangerate.host/) for providing free currency API
- [Recharts](https://recharts.org/) for chart components
- [React Select](https://react-select.com/) for enhanced dropdowns
- [Flags API](https://flagsapi.com/) for country flags

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Contact: your-email@example.com

---

**Made with ❤️ by [Your Name]**

*Perfect for portfolios, resumes, and learning React!* 