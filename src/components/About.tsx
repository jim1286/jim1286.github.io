import React from 'react';
import { Row, Col, Card, Typography, Avatar } from 'antd';
import { 
  RocketOutlined, 
  BulbOutlined, 
  AimOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const AboutSection = styled.section`
  padding: 100px 0;
  background: ${props => props.theme.colors.backgroundLight};

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 60px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0 16px;
  }
`;

const SectionTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    margin-bottom: 3rem !important;
    color: ${props => props.theme.colors.text} !important;
    font-size: 2.5rem !important;
    font-weight: 700 !important;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background: ${props => props.theme.colors.primary};
      border-radius: 2px;
    }

    @media (max-width: ${props => props.theme.breakpoints.md}) {
      font-size: 2rem !important;
    }
  }
`;

const AboutText = styled.div`
  margin-bottom: 2rem;
`;

const StyledParagraph = styled(Paragraph)`
  &.ant-typography {
    font-size: 1.1rem !important;
    line-height: 1.8 !important;
    color: ${props => props.theme.colors.textLight} !important;
    margin-bottom: 1.5rem !important;
  }
`;

const ProfileImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    margin-bottom: 1rem;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 250px !important;
  height: 250px !important;
  box-shadow: ${props => props.theme.shadows.large} !important;
  border: 3px solid white !important;
  
  img {
    object-fit: cover !important;
    width: 100% !important;
    height: 100% !important;
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    width: 200px !important;
    height: 200px !important;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled(Card)`
  text-align: center;
  transition: all 0.3s ease;
  border-radius: ${props => props.theme.borderRadius.large} !important;
  box-shadow: ${props => props.theme.shadows.small} !important;
  border: 1px solid ${props => props.theme.colors.border} !important;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium} !important;
  }

  .ant-card-body {
    padding: 24px 16px !important;
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const StatTitle = styled(Title)`
  &.ant-typography {
    font-size: 1rem !important;
    font-weight: 600 !important;
    color: ${props => props.theme.colors.text} !important;
    margin: 0 !important;
  }
`;

const stats = [
  {
    icon: <RocketOutlined />,
    title: '성장 지향적',
    description: '지속적인 학습과 발전'
  },
  {
    icon: <BulbOutlined />,
    title: '문제 해결력',
    description: '창의적 사고와 해결책 제시'
  },
  {
    icon: <AimOutlined />,
    title: '목표 달성',
    description: '체계적인 계획과 실행'
  }
];

const About: React.FC = () => {
  return (
    <AboutSection id="about">
      <Container>
        <SectionTitle level={2}>소개</SectionTitle>
        
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <AboutText>
              <StyledParagraph>
                안녕하세요! 저는 새로운 기술을 배우고 창의적인 문제 해결을 즐기는 
                개발자 <strong>황지민</strong>입니다.
              </StyledParagraph>
              <StyledParagraph>
                사용자 경험을 중시하며, 깔끔하고 효율적인 코드 작성을 지향합니다. 
                끊임없이 성장하며 더 나은 개발자가 되기 위해 노력하고 있습니다.
              </StyledParagraph>
              <StyledParagraph>
                현재는 TypeScript, React를 활용한 프론트엔드 개발과 Node.js, Nest.js, 
                FastAPI를 사용한 백엔드 개발을 하고 있으며, Docker를 통한 컨테이너화와 
                MySQL 데이터베이스 설계에 경험이 있습니다.
              </StyledParagraph>
            </AboutText>

            <StatsContainer>
              {stats.map((stat, index) => (
                <StatCard key={index} size="small">
                  <StatIcon>{stat.icon}</StatIcon>
                  <StatTitle level={5}>{stat.title}</StatTitle>
                  <p style={{ 
                    margin: 0, 
                    color: '#8c8c8c', 
                    fontSize: '0.9rem' 
                  }}>
                    {stat.description}
                  </p>
                </StatCard>
              ))}
            </StatsContainer>
          </Col>

          <Col xs={24} lg={12}>
            <ProfileImageContainer>
              <StyledAvatar 
                src="/profile.jpg" 
                alt="황지민 프로필 사진"
              />
            </ProfileImageContainer>
          </Col>
        </Row>
      </Container>
    </AboutSection>
  );
};

export default About;