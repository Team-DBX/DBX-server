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

# ⚙️ Challenges

DBX를 개발하면서 크게 3가지 어려웠던 점이 있었습니다.

- 예측 가능한 S3 url을 만들기 위한 MongoDB와 S3 파이프라인 구축
- RESTful API 설계를 위한 데이터 구조
- 로그인 유지를 위해 IndexDB에 저장된 로그인 정보 활용하기

> [!NOTE]
> 챌린지에 들어가기 앞서 필요한 설명들을 하고 넘어가겠습니다.
>
> - 카테고리 : BrandLogo, Icon, KeyImage
> - 리소스 : 브랜드의 로고, 키이미지, 아이콘 등의 이미지
> - 리소스 버전 : 리소스마다 가지고 있는 버전별 이미지들

## 1. MongoDB와 S3 파이프라인으로 예측 가능한 S3 url 만들기

S3 버킷을 사용할 때, url을 직접 정할 수 있다는 사실을 알게 되었습니다. 정해진 규칙과 유니크한 값을 통해 url을 생성할 수 있었습니다. 문제는 유니크한 값을 어떻게 저장하고 만들것인가의 문제였습니다. S3 하나의 버킷 안에서는 유니크한 값을 가져야 중복되지 않는 S3 url을 만들 수 있었습니다. 이에 저는 유니크한 값을 주는 MonogoDB의 .\_id 값을 url에 적용해보면 어떨까라는 생각이 들었습니다.

MongoDB와 S3 파이프라인으로 에측 가능한 url을 만드는 과정은 다음과 같았습니다.

- 클라이언트 사이드에서 서버로 이미지와, 세부 정보들을 넘긴다.
- 서버는 클라이언트에서 받은 이미지 이름 및 상세 설명들을 이용해 일단 DB에 저장해둡니다.
- DB에서 저장한 다음 받은 .id 값으로 ObjectId + "/" + el.fileName + ".svg"와 같은 형식으로 예측 가능한 s3 url을 생성한다.
- 생성된 S3url과 svg를 png로 변환한 이미지를 이미 저장된 데이터에 정보 업데이트를 한다.

<img src = "https://github.com/Team-DBX/DBX-client/assets/93499071/b7250272-fd50-4976-a008-209e84a5b515" height="300px" width="450px"/>

이 파이프라인을 통해 DB의 object.\_id를 통해 url을 예측할 수 있게 되었다.

## 2. RESTful API 설계를 위한 데이터 구조

RESTful한 API는 다양한 장점을 가지고 있지만, 브랜드 리소스 버전 관리 툴인 만큼 URL을 통해 리소스를 명확하게 식별하므로, 버전 관리가 용이하다고 생각했습니다. 또한, API를 확장하거나 수정하는 것이 비교적 간단하여 유지보수가 용이하기 때문에 RESTful API를 설계하기로 했습니다.

데이터 구조를 설계하며 가장 고민 많이 한 부분은 2가지입니다.

1. 어떤 방식이 필요한 데이터를 찾을때 효율적으로 순회하는 데이터 구조일까?
2. RESTful 한 구조인가?

### 2.1 카테고리별 별도의 데이터 구조

처음 설계한 데이터 구조는 카테고리별로 각자 스키마를 가지고 있었습니다.
<img src="https://github.com/Team-DBX/DBX-client/assets/93499071/446c06f2-6f7c-483f-b1d2-da23ff9f49f3" width ="600px"/>

이 구조의 장점은 카테고리별로 방을 가지고 있기 때문에 모든 리소스들이 합쳐있는것 보다 불필요한 순회를 하지 않을것입니다. 하지만, RESTful하지 않다는 단점이 있습니다.
BrandLogo, KeyImage, Icon을 하나로 묶어주는 상위 카테고리가 없고, 또한 중복된 코드가 너무 많다는 판단을 하였다.

### 2.2 하나의 상위 개념으로 통합된 데이터 구조

3개의 카테고리가 거의 동일한 형태를 가지고 있다는 점에서 아래와 같은 구조로 데이터 구조를 짜보았다.

<img width="709" alt="image" src="https://github.com/Team-DBX/DBX-client/assets/93499071/8180a5b3-794b-4a7e-80d3-5cce426863f8">

먼저, Categories라는 상위 카테고리를 만들어서 API 작성시, 자원의 구조를 명확히 보일 수 있도록 하였다. 또한, Resource와 ResourceVersions를 각각 카테고리별로 스키마를 설계하던 모습에서 하나의 스키마로 통합하면서, 변경 사항이 있을시, 유지 보수가 편해졌고 확장성도 생겼습니다.
마지막으로 많이 고민했던, 필요하지 않은 순회는 각 스키마마다 관계형 DB처럼 fk키 즉, 참조할 수 있는 Object ID를 가지고 있음으로써 불필요한 순회를 Object.\_id로 해결하였습니다.

## 3. 로그인 유지를 위해 IndexDB에 저장된 로그인 정보 활용하기

firebase를 이용한 소셜 로그인을 구현하고 있다. firebase는 IndexDB에 현재 로그인되어 있는 사용자의 정보가 들어있다. firebase는 refreshToken가 만료되기도 하기 때문에 로그인되어 있다가도 오랜 시간이 지나면 로그아웃 되도록 구현해야 했다.

```
useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setUserCredentials(user.accessToken, user.email);
        navigate("/resource-list/BrandLogo");
      } else {
        navigate("/login");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUserCredentials]);
```

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
