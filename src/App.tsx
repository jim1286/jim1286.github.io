import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import koKR from 'antd/locale/ko_KR';
import styled, { ThemeProvider } from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: #fff;
`;

const StyledContent = styled(Content)`
  overflow: hidden;
`;

const HomePage: React.FC = () => (
  <>
    <Hero />
    <About />
    <Skills />
    <Projects />
    <Contact />
  </>
);

const App: React.FC = () => {
  return (
    <ConfigProvider locale={koKR}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <StyledLayout>
            <Navbar />
            <StyledContent>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/project/:id" element={<ProjectDetail />} />
              </Routes>
            </StyledContent>
            <Footer />
          </StyledLayout>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
