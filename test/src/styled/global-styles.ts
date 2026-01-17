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
    --color-secondary: #d4af37;
    --color-bg-main: #f8f5f2;
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

  /* Основной текст - стандартный системный шрифт */
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                 'Helvetica Neue', Arial, sans-serif;
    color: var(--color-text-dark);
    background-color: var(--color-bg-main);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Все заголовки - Isadora Cyr */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Isadora Cyr', Georgia, 'Times New Roman', Times, serif;
    font-style: italic;
    font-weight: normal;
  }

  /* Элементы, которые наследуют body шрифт */
  p, span, a, li, div, section, article, button, input, textarea {
    font-family: inherit; /* Наследует от body */
  }

  /* Если шрифт не подключается, fallback для заголовков */
  @supports not (font-family: 'Isadora Cyr') {
    h1, h2, h3, h4, h5, h6 {
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

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

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
