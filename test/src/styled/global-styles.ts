import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Isadora Cyr';
    src: url('/fonts/Isadora_Cyr.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  :root {
    /* Основные цвета как в референсе */
    --color-primary: #1a1a1a;
    --color-secondary: #d4af37; /* Золотистый */
    --color-bg-main: #f8f5f2; /* Основной фоновый цвет */
    --color-bg-light: #ffffff;
    --color-text-dark: #1a1a1a;
    --color-text-light: #ffffff;
    --color-text-gray: #666666;
    --color-border: #e8e4e0;
    
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Isadora Cyr', system-ui, Avenir, Helvetica, Arial, sans-serif;
    color: var(--color-text-dark);
    background-color: var(--color-bg-main);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Если шрифт не подключается, добавьте fallback */
  @supports not (font-family: 'Isadora Cyr') {
    body {
      font-family: Georgia, 'Times New Roman', Times, serif;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    outline: none;
  }

  /* Сброс стилей для кнопок */
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  /* Адаптивность */
  @media (max-width: 768px) {
    html {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    html {
      font-size: 14px;
    }
  }
`;
