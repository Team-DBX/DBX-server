<div style="display: flex; justify-content: center;">
  <img style="width: 500px; " alt="DBX Logo" src="https://github.com/Team-DBX/DBX-client/assets/93499071/b73d667c-b08e-4eb4-ba23-2b0c1386e469">
</div>
<div style="text-align: center;">Developer와 Designer가 협업할 수 있는 Brand Experience <strong>리소스 관리 툴</strong> DBX입니다.</div>
<br />

# 📒 Table of Contents

- [Preview](#🎬-Preview) <br/>
- [Introduction](#🙌-Introduction)
- [Challenges](#⚙️-Challenges)
- [Tech Stack](#🛠️-Tech-Stacks)
- [Features](#🪢-Features)
- [Project Contribution](#✍️-Project-Contribution)
- [Members](#👥-Members)

# 🎬 Preview

# 🙌 Introduction

## Motivation

비전공자인 저희 팀은 평소 개발자와 개발자가 아닌 직군 사이의 **협업**이 필요한 부분이 무엇이 있을까 궁금했습니다. <br/>
그래서 협업자들의 다양한 의견을 듣던 중 디자이너와 개발자 사이의 헙업을 도와줄 수 있는 **리소스 관리 툴**을 생각하게 되었습니다. <br/>
Brand Experience Design인 BX는 브랜드 사용자 경험 디자인을 말합니다.<br/>
브랜드의 가치, 의미를 사용자에게 긍정적인 경험을 만들어서 브랜드의 긍정적이고 좋은 이미지를 형성 시키는 것을 말합니다.<br/>
BX를 유지하기 위해서는 브랜드에서 만드는 브랜드 이미지 리소스들을 관리할 필요가 있습니다.<br/>
리소스를 회사 전체 직원들이 편하게 가져갈 수 있고, 리소스의 디자인이 바뀔 때마다 회사 홈페이지 배너를 바로 반영이 되는 버전 관리 툴을 개발하게 되었습니다.<br/>
**DBX**는 디자이너와 개발자 사이의 협업을 도와주는 어플리케이션으로, 그래픽 리소스의 버전 관리와 고정 url을 제공하여 리소스 자동 업데이트를 빠르게 반영 시킵니다. **DBX**를 통해 디자이너가 리소스를 업데이트하면, 해당 웹사이트가 자동으로 업데이트되어 프로젝트의 효율성을 극대화하며, 더 나은 협업 환경을 제공합니다.

## Schedule

프로젝트 기간: **2023.07.10 ~ 2023.08.03** / 기획 10일 개발 15일

<details close>
  <summary>1주차 일정</summary>
  <li> 아이디어 수집 </li>
  <li> Git 플로우 정하기 </li>
  <li> 코드 컨벤션, 커밋 룰 등 팀 협업 규칙 정립 </li>
  <li> Figma를 사용한 Mockup 제작 </li>
  <li> Notion을 사용한 칸반 작성 </li>
</details>

<br/>

<details close>
  <summary>2주차 ~ 3주차 일정</summary>
  <li> husky, eslint, lint-staged를 사용한 초기 설정 </li>
  <li> 프론트엔드, 백엔드 보일러 플레이트 초기 설정 </li>
  <li> S3 초기 설정 </li>
  <li> Firebase 로그인 구현 </li>
  <li> 백엔드 기능 구현 </li>
  <li> 프론트엔드 기능 구현 </li>
  <li> 팀프로젝트 발표 </li>
</details>

<br/>

# ⚙️ Challenges

DBX를 개발하면서 크게 3가지 어려웠던 점이 있었습니다.

- 어떤 스키마 구조가 가장 효율적일까?
- S3 이미지 업로드를 서버와 클라이언트 중에 어디서 수행할지?
- 데이터 리소스의 버전이 바뀌어도 고정 url로 제공을 어떻게 할 것인지?

## 어떤 스키마 구조가 가장 효율적일까?

### 1. 카테고리별로 데이터를 분류하는 스키마 구조.

DBX가 카테고리로 삼는 브랜드 이미지 리소스는 세가지입니다. BrandLogo, KeyImage, Icon 세 카테고리에 대한 각각의 Schema를 구상했습니다. 각 리소스는 고유한 이름을 가지고 있고 리소스 버전 업데이트가 가능했기에, 리소스마다 버전별로 데이터를 가지고 있어야 했습니다. 그리하여 아래와 같은 스키마 구조를 가지게 되었습니다.
<img src="https://github.com/sewonjun/leethub/assets/93499071/272da10e-61ee-44aa-a0ad-6ff81c7794cb" width="500px" />

## S3 업로드를 어디서 진행할것인가? client side vs server side

client side에서 S3 업로드를 진행하는 것과 server side에서 업로드를 진행하는 것은 장단점이 있습니다.
client side에서 진행할 경우, 직접 클라이언트에서 업로드되므로 서버 리소스를 절약하고 빠른 업로드 속도를 제공합니다. 또한 서버에서 업로드를 진행하지 않기 때문에 서버 부하가 줄어들 수 있습니다.

서버 측에서 S3에 업로드하는 것을 선택한 이유는 다양한 이점들이 있었습니다. 먼저, S3에 저장할 때 URL 네이밍에 MongoDB ObjectId를 포함시킨 것은 데이터의 일관성과 유니크함을 보장하기 위해서였습니다. MongoDB ObjectId는 각각의 독립된 문서에 고유한 값을 부여하므로, 중복되지 않는 고유한 URL을 생성하여 저장할 수 있었습니다. 이를 통해 파일의 식별이 용이해지고, 관리 및 검색도 훨씬 편리해졌습니다.

또한, 서버 측에서 업로드를 처리하면 클라이언트 측의 사용자 경험을 개선할 수 있습니다. 대용량 파일의 경우 클라이언트에서 업로드하는 데에 시간이 오래 걸리거나 오류가 발생할 수 있습니다. 그러나 서버 측에서 업로드를 처리하면 백그라운드에서 비동기적으로 작업을 수행하므로 사용자는 기다리는 시간을 최소화하고 원활한 경험을 얻을 수 있습니다.

이와 같이 서버 측에서 S3에 업로드하는 방식은 데이터 일관성, 사용자 경험 등 다양한 측면에서 이점을 제공합니다.
그래서 server 쪽에서 S3 업로드 방식을 택하였습니다.

## 데이터 리소스의 버전이 바뀌어도 고정 url로 제공을 어떻게 할 것인가?

# 🛠️ Tech Stacks

## Frontend

<!-- React -->
<img src= "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
<!-- TailWind -->
<img src= "https://img.shields.io/badge/TailWind-06B6D4?style=for-the-badge&logo=Tailwind CSS&logoColor=black">
<!-- Firebase -->
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
<br/>

## Backend

<!-- Express -->
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white"/>
<!-- MongoDB & Mongoose -->
<img src="https://img.shields.io/badge/MongoDB&Mongoose-47A248?style=for-the-badge&logo=MongoDB&logoColor=white"/>
<!-- Firebase -->
<img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
<!-- Node Js -->
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/>
<br/>
<br/>

# 🪢 Features

- 최초 사용자가 Login하면 **Brand logo를 업로드**할 수 있는 화면이 출력 됩니다.
- 사용자는 Brand logo upload 화면에서 6가지 Mode(**Default, Dark mode, 1.5x, 2x, 3x, 4x**)의 `.svg`이미지와 해당 이미지 그룹의 대표 **Name, Description**을 설정할 수 있습니다.
- **Done** 버튼을 눌러 Upload를 완료합니다.
- Upload가 완료되면 제일 처음에는 **Brand logo category**의 **Resource list**를 보여줍니다.
- 각 Category list(**Brand logo, Key image, Icon**)화면의 기능은 모두 동일합니다.
- Admin 사용자일 경우 리소스 썸네일에 **Update, Delete**버튼이 표시되며 리소스를 추가할 수 있는 **'+'**버튼이 노출 됩니다.
- 일반 사용자일 경우 썸네일 이미지만 보여집니다.(편집 권한 없음)
- Update 버튼을 누르면 해당 리소스의 **Version을 update**할 수 있는 화면으로 이동합니다.
- 해당 화면에서는 [Sementic Versioning](https://semver.org/)규칙에 의거하여 **Version name**을 입력할 수 있으며 Update시킬 `.svg`이미지와 Description을 작성할 수 있습니다.
- Delete 버튼을 누르면 해당 **리소스를 삭제**할 수 있습니다.
- 썸네일 클릭 시 해당 리소스 **Modal**이 보여지며 우측 판넬에 리소스의 상세 정보(**Name, Category, Upload date, Author, Version**)를 볼 수 있습니다.
- 우측 패널에는 상세 정보 외에도 리소스**고정 URL, Mode별 svg, png Download** 기능을 제공합니다.
- Modal창의 Previou version 버튼을 누르면 **이전 Version의 목록**을 볼 수 있는 화면으로 이동합니다.
- Version 목록은 최신 -> 초기 순으로 정렬 되어있고 각각의 리소스는 Download할 수 있습니다.

# ✍️ Project Contribution

<details>
<summary style="font-size:20px">Frontend Contribution</summary>

| 구분                | 전세원 | 조빈 |
| ------------------- | -----: | ---: |
| Login               |    10% |  90% |
| New Resource Form   |    10% |  90% |
| Resource Card       |    10% |  90% |
| Resource List       |    10% |  90% |
| Resource Modal      |    10% |  90% |
| Admin Resource List |    10% |  90% |
| Resource Version    |    10% |  90% |
| New Version Form    |    10% |  90% |

</details>
<br/>
<details>
<summary style="font-size:20px">Backend Contribution</summary>

| 구분                | 전세원 | 조빈 |
| ------------------- | -----: | ---: |
| Login               |    90% |  10% |
| New Resource Form   |    90% |  10% |
| Resource Card       |    90% |  10% |
| Resource List       |    90% |  10% |
| Resource Modal      |    90% |  10% |
| Admin Resource List |    90% |  10% |
| Resource Version    |    90% |  10% |
| New Version Form    |    90% |  10% |

</details>
<br/>

# 👥 Members

<table>
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/u/93499071?v=4" alt="전세원 프로필" width="300px" height="300px">
    </td>
   <td align="center">
	    <img src="https://avatars.githubusercontent.com/u/35984962?v=4" alt="조빈 프로필" width="300px" height="300px" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <ul>
        <li><a href="https://github.com/sewonjun">Sewon Jun 전세원</a></li>
        <li>junsewon77@gmail.com</li>
      </ul>
    </td>
    <td align="center">
      <ul>
        <li><a href="https://github.com/koreanerd">Bin Jo 조빈</a></li>
        <li>qksksk0147@gmail.com</li>
      </ul>
    </td>
  </tr>
</table>
