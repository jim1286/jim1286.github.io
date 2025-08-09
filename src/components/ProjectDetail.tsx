import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Tag, Typography } from "antd";
import {
  ArrowLeftOutlined,
  GithubOutlined,
  LinkOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Title, Paragraph, Text } = Typography;

const DetailSection = styled.section`
  min-height: 100vh;
  padding: 100px 0;
  background: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 16px;
  }
`;

const BackButton = styled(Button)`
  margin-bottom: 2rem;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;

  &:hover {
    color: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
  }
`;

const ProjectHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const ProjectIcon = styled.div<{ $bgColor: string }>`
  width: 120px;
  height: 120px;
  background: ${(props) => props.$bgColor};
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 3rem;
  color: white;
  box-shadow: ${(props) => props.theme.shadows.medium};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProjectTitle = styled(Title)`
  &.ant-typography {
    color: ${(props) => props.theme.colors.text} !important;
    margin-bottom: 1rem !important;
    font-size: 2.5rem !important;
    font-weight: 700 !important;

    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      font-size: 2rem !important;
    }
  }
`;

const ProjectSubtitle = styled(Paragraph)`
  &.ant-typography {
    font-size: 1.1rem !important;
    color: ${(props) => props.theme.colors.textLight} !important;
    max-width: 800px;
    margin: 0 auto 2rem !important;
    line-height: 1.6 !important;
  }
`;

const TechTags = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 2rem;
`;

const TechTag = styled(Tag)`
  padding: 6px 12px !important;
  border-radius: 16px !important;
  font-size: 0.9rem !important;
  background: ${(props) => props.theme.colors.primary} !important;
  color: white !important;
  border: none !important;
`;

const ProjectLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 3rem;
`;

const LinkButton = styled(Button)`
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  font-size: 1rem !important;
  height: 40px !important;
  padding: 0 20px !important;

  &.primary {
    background: ${(props) => props.theme.colors.primary} !important;
    border-color: ${(props) => props.theme.colors.primary} !important;
  }

  &.secondary {
    color: ${(props) => props.theme.colors.text} !important;
    border-color: ${(props) => props.theme.colors.border} !important;

    &:hover {
      color: ${(props) => props.theme.colors.primary} !important;
      border-color: ${(props) => props.theme.colors.primary} !important;
    }
  }
`;

const ContentSection = styled.div`
  background: ${(props) => props.theme.colors.backgroundLight};
  border-radius: ${(props) => props.theme.borderRadius.large};
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const SectionTitle = styled(Title)`
  &.ant-typography {
    color: ${(props) => props.theme.colors.text} !important;
    font-size: 1.5rem !important;
    font-weight: 600 !important;
    margin-bottom: 1rem !important;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 0.8rem;

  .anticon {
    color: ${(props) => props.theme.colors.primary};
    margin-top: 4px;
  }
`;

const FeatureText = styled(Text)`
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
`;

const ScreenshotContainer = styled.div`
  margin-top: 1rem;
  position: relative;
`;

const ScreenshotSlider = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 10px 0;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => props.theme.colors.backgroundLight};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${(props) => props.theme.colors.primary};
    }
  }

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    gap: 0.8rem;
  }
`;

const ScreenshotItem = styled.div`
  flex: 0 0 auto;
  width: 200px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    width: 160px;
  }
`;

const ScreenshotImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: ${(props) => props.theme.shadows.medium};
  }
`;

const ScreenshotCaption = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: ${(props) => props.theme.colors.textLight};
`;

// 프로젝트 데이터
const projectsData = {
  1: {
    id: 1,
    title: "야잘알 - 야구 잘 알려준다",
    subtitle:
      "한국 프로야구(KBO) 선수들의 통계를 직관적이고 아름답게 보여주는 모바일 애플리케이션",
    description: `야잘알은 한국 프로야구(KBO) 팬들을 위한 종합 통계 애플리케이션입니다. 
    선수들의 상세한 통계 정보부터 팀별 비교, 시즌별 성적 추이까지 한눈에 볼 수 있도록 설계되었습니다.
    
    Flutter로 개발되어 iOS와 Android 모두에서 네이티브 수준의 성능과 사용자 경험을 제공하며,
    직관적인 UI/UX와 아름다운 차트를 통해 복잡한 야구 통계를 쉽게 이해할 수 있습니다.`,
    technologies: [
      "Flutter",
      "Dart",
      "Provider",
      "fl_chart",
      "Google Mobile Ads",
      "HTTP",
      "JSON Serialization",
    ],
    icon: <img src="/images/yajalal/logo.png" alt="Yajalal 로고" />,
    bgColor: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
    features: [
      "실시간 선수 통계 조회 및 상세 정보 제공",
      "팀별 선수 목록 및 포지션별 분류",
      "시즌별, 월별, 주간별 성적 추이 차트",
      "선수 간 스탯 비교 기능",
      "직관적인 검색 및 필터링 시스템",
      "경기 일정 및 결과 확인",
      "팀 순위 및 통계 비교",
      "나만의 팀 구성 기능",
      "반응형 디자인으로 모든 기기 대응",
    ],
    challenges: [
      {
        title: "대용량 데이터 처리",
        solution: "Provider 패턴과 효율적인 상태 관리로 성능 최적화",
      },
      {
        title: "복잡한 통계 시각화",
        solution: "fl_chart 라이브러리를 활용한 인터랙티브 차트 구현",
      },
      {
        title: "사용자 경험 최적화",
        solution: "직관적인 네비게이션과 스켈레톤 로딩으로 부드러운 UX 구현",
      },
    ],
    achievements: [
      "10만+ 다운로드 달성",
      "평점 4.8/5.0 유지",
      "월간 활성 사용자 50,000+명",
    ],
    liveUrl: "#",
    githubUrl: "#",
  },
};

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = id
    ? projectsData[parseInt(id) as keyof typeof projectsData]
    : null;

  if (!project) {
    return (
      <DetailSection>
        <Container>
          <BackButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/")}
          >
            홈으로 돌아가기
          </BackButton>
          <Title level={2}>프로젝트를 찾을 수 없습니다.</Title>
        </Container>
      </DetailSection>
    );
  }

  const handleLinkClick = (url: string) => {
    if (url !== "#") {
      window.open(url, "_blank");
    }
  };

  return (
    <DetailSection>
      <Container>
        <BackButton icon={<ArrowLeftOutlined />} onClick={() => navigate("/")}>
          프로젝트 목록으로
        </BackButton>

        <ProjectHeader>
          <ProjectIcon $bgColor={project.bgColor}>{project.icon}</ProjectIcon>

          <ProjectTitle level={1}>{project.title}</ProjectTitle>
          <ProjectSubtitle>{project.subtitle}</ProjectSubtitle>

          <TechTags>
            {project.technologies.map((tech, index) => (
              <TechTag key={index}>{tech}</TechTag>
            ))}
          </TechTags>

          <ProjectLinks>
            <LinkButton
              type="primary"
              className="primary"
              icon={<LinkOutlined />}
              onClick={() => handleLinkClick(project.liveUrl)}
            >
              앱 다운로드
            </LinkButton>
            <LinkButton
              className="secondary"
              icon={<GithubOutlined />}
              onClick={() => handleLinkClick(project.githubUrl)}
            >
              GitHub
            </LinkButton>
          </ProjectLinks>
        </ProjectHeader>
        <ContentSection>
          <SectionTitle level={3}>앱 스크린샷</SectionTitle>
          <ScreenshotContainer>
            <ScreenshotSlider>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/01.png"
                  alt="Yajalal 앱 메인 화면"
                  loading="lazy"
                />
                <ScreenshotCaption>메인 화면</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/02.png"
                  alt="선수 통계 화면"
                  loading="lazy"
                />
                <ScreenshotCaption>선수 통계</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/03.png"
                  alt="팀 순위 화면"
                  loading="lazy"
                />
                <ScreenshotCaption>팀 순위</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/04.png"
                  alt="선수 상세 정보"
                  loading="lazy"
                />
                <ScreenshotCaption>선수 상세</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/05.png"
                  alt="통계 차트 뷰"
                  loading="lazy"
                />
                <ScreenshotCaption>통계 차트</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/06.png"
                  alt="경기 일정"
                  loading="lazy"
                />
                <ScreenshotCaption>경기 일정</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/07.png"
                  alt="나만의 팀 구성"
                  loading="lazy"
                />
                <ScreenshotCaption>팀 구성</ScreenshotCaption>
              </ScreenshotItem>
              <ScreenshotItem>
                <ScreenshotImage
                  src="/images/yajalal/08.png"
                  alt="검색 및 필터"
                  loading="lazy"
                />
                <ScreenshotCaption>검색 필터</ScreenshotCaption>
              </ScreenshotItem>
            </ScreenshotSlider>
          </ScreenshotContainer>
        </ContentSection>

        <ContentSection>
          <SectionTitle level={3}>프로젝트 소개</SectionTitle>
          <Paragraph
            style={{
              fontSize: "1rem",
              lineHeight: "1.8",
              color: "#666",
              whiteSpace: "pre-line",
            }}
          >
            {project.description}
          </Paragraph>
        </ContentSection>

        <ContentSection>
          <SectionTitle level={3}>주요 기능</SectionTitle>
          <FeatureList>
            {project.features.map((feature, index) => (
              <FeatureItem key={index}>
                <CheckCircleOutlined />
                <FeatureText>{feature}</FeatureText>
              </FeatureItem>
            ))}
          </FeatureList>
        </ContentSection>
      </Container>
    </DetailSection>
  );
};

export default ProjectDetail;
