import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Tag, Typography, Row, Col } from "antd";
import { GithubOutlined, LinkOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Title, Paragraph } = Typography;

const ProjectsSection = styled.section`
  padding: 100px 0;
  background: ${(props) => props.theme.colors.backgroundLight};

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 60px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: ${(props) => props.theme.breakpoints.md}) {
    padding: 0 16px;
  }
`;

const SectionTitle = styled(Title)`
  &.ant-typography {
    text-align: center;
    margin-bottom: 3rem !important;
    color: ${(props) => props.theme.colors.text} !important;
    font-size: 2.5rem !important;
    font-weight: 700 !important;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 3px;
      background: ${(props) => props.theme.colors.primary};
      border-radius: 2px;
    }

    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
      font-size: 2rem !important;
    }
  }
`;

const ProjectCard = styled(Card)`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: ${(props) => props.theme.borderRadius.large} !important;
  overflow: hidden;
  box-shadow: ${(props) => props.theme.shadows.small} !important;
  border: 1px solid ${(props) => props.theme.colors.border} !important;

  &:hover {
    transform: translateY(-10px);
    box-shadow: ${(props) => props.theme.shadows.large} !important;
    cursor: pointer;
  }

  .ant-card-body {
    padding: 24px !important;
  }

  .ant-card-cover {
    height: 200px;
    overflow: hidden;
  }
`;

const ProjectImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: ${(props) => props.theme.colors.backgroundLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .anticon {
    position: relative;
    z-index: 1;
  }

  img {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProjectTitle = styled(Title)`
  &.ant-typography {
    font-size: 1.3rem !important;
    font-weight: 600 !important;
    color: ${(props) => props.theme.colors.text} !important;
    margin-bottom: 1rem !important;
  }
`;

const ProjectDescription = styled(Paragraph)`
  &.ant-typography {
    color: ${(props) => props.theme.colors.textLight} !important;
    margin-bottom: 1rem !important;
    line-height: 1.6 !important;
  }
`;

const TechTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 1.5rem;
`;

const TechTag = styled(Tag)`
  padding: 2px 8px !important;
  border-radius: 12px !important;
  font-size: 0.8rem !important;
  background: ${(props) => props.theme.colors.backgroundLight} !important;
  color: ${(props) => props.theme.colors.textLight} !important;
  border: 1px solid ${(props) => props.theme.colors.border} !important;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 8px;
`;

const LinkButton = styled(Button)`
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  font-size: 0.9rem !important;
  height: 32px !important;

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

const projects = [
  {
    id: 1,
    title: "야잘알 - 야구 잘 알려준다",
    description:
      "한국 프로야구(KBO) 선수들의 통계를 직관적이고 아름답게 보여주는 Flutter 모바일 애플리케이션입니다. 선수별/팀별 상세 통계, 시즌별/월별 성적 추이 차트, 검색 및 필터 기능을 제공합니다.",
    technologies: [
      "Flutter",
      "Dart",
      "Provider",
      "fl_chart",
      "Google Mobile Ads",
    ],
    icon: <img src="/images/yajalal/logo.png" alt="Yajalal 로고" />,
    bgColor: "linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)",
    liveUrl: "#",
    githubUrl: "#",
  },
];

const Projects: React.FC = () => {
  const navigate = useNavigate();

  const handleLinkClick = (url: string) => {
    if (url !== "#") {
      window.open(url, "_blank");
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <ProjectsSection id="projects">
      <Container>
        <SectionTitle level={2}>프로젝트</SectionTitle>

        <Row gutter={[24, 24]}>
          {projects.map((project) => (
            <Col xs={24} md={12} lg={8} key={project.id}>
              <ProjectCard
                cover={
                  <ProjectImagePlaceholder
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {project.icon}
                  </ProjectImagePlaceholder>
                }
                onClick={() => handleProjectClick(project.id)}
              >
                <ProjectTitle level={4}>{project.title}</ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>

                <TechTags>
                  {project.technologies.map((tech, index) => (
                    <TechTag key={index}>{tech}</TechTag>
                  ))}
                </TechTags>

                <ProjectLinks>
                  <LinkButton
                    type="primary"
                    size="small"
                    className="primary"
                    icon={<EyeOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project.id);
                    }}
                  >
                    자세히 보기
                  </LinkButton>
                  <LinkButton
                    size="small"
                    className="secondary"
                    icon={<LinkOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkClick(project.liveUrl);
                    }}
                  >
                    Live Demo
                  </LinkButton>
                  <LinkButton
                    size="small"
                    className="secondary"
                    icon={<GithubOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLinkClick(project.githubUrl);
                    }}
                  >
                    GitHub
                  </LinkButton>
                </ProjectLinks>
              </ProjectCard>
            </Col>
          ))}
        </Row>
      </Container>
    </ProjectsSection>
  );
};

export default Projects;
