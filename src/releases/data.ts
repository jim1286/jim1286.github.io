// Original notes come from immutable release manifests, GitHub release text and
// the complete returned App Store version/localization history. Metadata creation
// and source record dates are not public release dates. See docs/RELEASE_NOTES.md.
export type ReleasePlatformState = { platform: 'ios' | 'android'; status: 'review' | 'submitted' | 'internal' | 'closed-review' | 'available'; asOf: string };
export type ReleaseNote = { id: string; app: string; version: string; recordedOn: string; notes: string; sourceTag?: string; sourceSha?: string; notesSource?: 'manifest' | 'app-store' | 'github-release'; originalSourceNotes?: string; storeMetadataCreatedAt?: string; storeObservedAt?: string; platforms: ReleasePlatformState[] };
export const releaseNotes: ReleaseNote[] = [
  {
    "id": "diairy-1.9.8",
    "app": "diairy",
    "version": "1.9.8",
    "recordedOn": "2026-10-30",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v1.9.8",
    "sourceSha": "97a4ff52112fc149167e9fea1add2ca52b3bf4ae",
    "storeMetadataCreatedAt": "2026-10-29T13:36:15-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "choose-window-2.1.5",
    "app": "choose-window",
    "version": "2.1.5",
    "recordedOn": "2026-10-30",
    "notes": "홈과 저장 경로의 배치 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v2.1.5",
    "sourceSha": "6cf79724b93fbb4dc7147632d29209dae7bebb8d",
    "storeMetadataCreatedAt": "2026-10-29T19:26:01-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "yajalal-2.3.0",
    "app": "yajalal",
    "version": "2.3.0",
    "recordedOn": "2026-10-30",
    "notes": "선수 기록의 기간과 지표 선택, 팀 선수단 필터와 정렬을 개선하고 최근 경기 보기를 정리했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v2.3.0",
    "sourceSha": "2f2071598cd2b2a409f8c31b57a6a5051a309f5c",
    "storeMetadataCreatedAt": "2026-10-30T00:56:25-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "yajalal-2.2.7",
    "app": "yajalal",
    "version": "2.2.7",
    "recordedOn": "2026-10-30",
    "notes": "선수 기록의 기간과 지표 선택, 팀 선수단 필터와 정렬을 개선하고 최근 경기 보기를 정리했습니다.",
    "notesSource": "app-store",
    "sourceTag": "app-v2.2.7",
    "sourceSha": "16097b8f48e94666cd41e254b55a1558e41e1558",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-29T12:09:24-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "diairy-1.9.7",
    "app": "diairy",
    "version": "1.9.7",
    "recordedOn": "2026-10-30",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "notesSource": "manifest",
    "sourceTag": "app-v1.9.7",
    "sourceSha": "9a2019d7e275e8c58d7f7797c4e0af81c191775c",
    "platforms": []
  },
  {
    "id": "spint-1.3.6",
    "app": "spint",
    "version": "1.3.6",
    "recordedOn": "2026-10-29",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-29T11:47:08-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "spint-1.3.7",
    "app": "spint",
    "version": "1.3.7",
    "recordedOn": "2026-10-29",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-29T20:29:31-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "unairplane-1.1.8",
    "app": "unairplane",
    "version": "1.1.8",
    "recordedOn": "2026-10-29",
    "notes": "여정 화면 전환과 탑승권 스캔 권한 안내 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-29T19:46:09-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "burntok-1.8.0",
    "app": "burntok",
    "version": "1.8.0",
    "recordedOn": "2026-10-29",
    "notes": "약관 동의와 사진 보기 흐름을 개선하고 프로필 아바타 생성 및 공통 화면 동작을 안정화했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-29T23:43:06-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "utilverse-1.2.4",
    "app": "utilverse",
    "version": "1.2.4",
    "recordedOn": "2026-10-28",
    "notes": "홈 화면의 불필요한 세로 스크롤을 없애고 사진 보기, 글자 추출과 파일 저장의 안정성을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-28T19:08:35-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "yajalal-2.2.5",
    "app": "yajalal",
    "version": "2.2.5",
    "recordedOn": "2026-10-28",
    "notes": "선수 기록의 기간과 지표 선택, 팀 선수단 필터와 정렬을 개선하고 최근 경기 보기를 정리했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-28"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T13:41:44-07:00",
    "storeObservedAt": "2026-10-28T00:03:10.861Z",
    "sourceTag": "app-v2.2.5",
    "sourceSha": "84f737f0815323502d86eb73879f282f6fb6beb7"
  },
  {
    "id": "choose-window-2.1.4",
    "app": "choose-window",
    "version": "2.1.4",
    "recordedOn": "2026-10-28",
    "notes": "홈과 저장 경로의 배치 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T13:03:20-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z",
    "sourceTag": "app-v2.1.4",
    "sourceSha": "04d8da683bd290b01fd2b347f35ca0553372a05e"
  },
  {
    "id": "burntok-1.7.6",
    "app": "burntok",
    "version": "1.7.6",
    "recordedOn": "2026-10-28",
    "notes": "약관 동의와 사진 보기 흐름을 개선하고 프로필 아바타 생성 및 공통 화면 동작을 안정화했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T09:34:06-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "unairplane-1.1.7",
    "app": "unairplane",
    "version": "1.1.7",
    "recordedOn": "2026-10-28",
    "notes": "여정 화면 전환과 탑승권 스캔 권한 안내 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T12:21:18-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "diairy-1.9.5",
    "app": "diairy",
    "version": "1.9.5",
    "recordedOn": "2026-10-28",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T11:05:44-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z",
    "sourceTag": "app-v1.9.5",
    "sourceSha": "61528ae30d2c867259eb9b4e5ed19d16052862cd"
  },
  {
    "id": "spint-1.3.4",
    "app": "spint",
    "version": "1.3.4",
    "recordedOn": "2026-10-28",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-28"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-27T10:21:14-07:00",
    "storeObservedAt": "2026-10-28T00:03:10.861Z",
    "sourceTag": "app-v1.3.4",
    "sourceSha": "baf929ae2d3b8adca647880ec08c576a680e8e13"
  },
  {
    "id": "yajalal-2.2.6",
    "app": "yajalal",
    "version": "2.2.6",
    "recordedOn": "2026-10-28",
    "notes": "경기 일정과 날짜 선택 화면을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-28T04:04:12-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z",
    "sourceTag": "app-v2.2.6",
    "sourceSha": "6d4aa26dc28166e41f30a88645a589325b6d070a"
  },
  {
    "id": "diairy-1.9.6",
    "app": "diairy",
    "version": "1.9.6",
    "recordedOn": "2026-10-28",
    "notes": "둥지 기록과 편지 목록을 개선하고 로그인 유지 방식을 정리했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-28T04:43:28-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z",
    "sourceTag": "app-v1.9.6",
    "sourceSha": "c1ae5c379ffffb85d96624e6626d4ca79123ee84"
  },
  {
    "id": "spint-1.3.5",
    "app": "spint",
    "version": "1.3.5",
    "recordedOn": "2026-10-28",
    "notes": "꽃 기록과 로그인 유지 방식을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-28T05:54:08-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z",
    "sourceTag": "app-v1.3.5",
    "sourceSha": "7801cc6d5316c843aff3eefdbba29eedd8bd3706"
  },
  {
    "id": "yajalal-2.2.4",
    "app": "yajalal",
    "version": "2.2.4",
    "recordedOn": "2026-10-26",
    "notes": "홈 위젯과 잠금화면·Dynamic Island의 점수판을 새롭게 다듬었습니다. 앱을 닫은 뒤 홈 위젯의 경기 정보 갱신을 개선했습니다. 선수 기록에 시즌 누적 보기를 추가하고 경기별 선수 기록을 팀별 타자·투수 순서로 한눈에 볼 수 있도록 정리했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-28"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-25T10:55:21-07:00",
    "storeObservedAt": "2026-10-28T00:03:10.861Z",
    "sourceTag": "app-v2.2.4",
    "sourceSha": "368f6cbb972a61fd5ccc7c06b67ffa203996b1bd"
  },
  {
    "id": "utilverse-1.2.3",
    "app": "utilverse",
    "version": "1.2.3",
    "recordedOn": "2026-10-26",
    "notes": "홈 화면의 불필요한 세로 스크롤을 없애고 사진 보기, 글자 추출과 파일 저장의 안정성을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-25T10:12:04-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "yajalal-2.2.3",
    "app": "yajalal",
    "version": "2.2.3",
    "recordedOn": "2026-10-25",
    "notes": "선수 사진 보기와 라인업·분석 화면의 표시 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "review",
        "asOf": "2026-10-26"
      }
    ],
    "sourceTag": "app-v2.2.3",
    "sourceSha": "5b38788560c81f7424ea4226dc937ddc9ef7a807",
    "storeMetadataCreatedAt": "2026-10-25T10:55:21-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "choose-window-2.1.3",
    "app": "choose-window",
    "version": "2.1.3",
    "recordedOn": "2026-10-25",
    "notes": "홈과 저장 경로의 배치 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v2.1.3",
    "sourceSha": "f3b4c8e86b54523c3007fd3c03317fb976ed75c8",
    "storeMetadataCreatedAt": "2026-10-25T11:34:39-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "diairy-1.9.4",
    "app": "diairy",
    "version": "1.9.4",
    "recordedOn": "2026-10-25",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "sourceTag": "app-v1.9.4",
    "sourceSha": "5f8d3a50f845143a3c15858b0dd7930a6685bafd",
    "storeMetadataCreatedAt": "2026-10-25T08:58:01-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "burntok-1.7.5",
    "app": "burntok",
    "version": "1.7.5",
    "recordedOn": "2026-10-25",
    "notes": "약관 동의와 사진 보기 흐름을 개선하고 프로필 아바타 생성 및 공통 화면 동작을 안정화했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v1.7.5",
    "sourceSha": "9897468e53958c37c0cb80f7889b29888182fd9d",
    "storeMetadataCreatedAt": "2026-10-25T10:35:13-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "spint-1.3.3",
    "app": "spint",
    "version": "1.3.3",
    "recordedOn": "2026-10-25",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "sourceTag": "app-v1.3.3",
    "sourceSha": "33d86105783a8d6f461b1c4da32ca24c1412559b",
    "storeMetadataCreatedAt": "2026-10-25T07:31:01-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "unairplane-1.1.6",
    "app": "unairplane",
    "version": "1.1.6",
    "recordedOn": "2026-10-25",
    "notes": "여정 화면 전환과 탑승권 스캔 권한 안내 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "sourceTag": "app-v1.1.6",
    "sourceSha": "71a0833ce82f5772562010cb3e21aab7ae903cf0",
    "storeMetadataCreatedAt": "2026-10-25T09:38:36-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "yajalal-2.2.2",
    "app": "yajalal",
    "version": "2.2.2",
    "sourceTag": "app-v2.2.2",
    "sourceSha": "00f2fe79e164da37b84daaa881323ab054e65660",
    "recordedOn": "2026-10-24",
    "notes": "선수 사진 보기와 라인업·분석 화면의 표시 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T17:54:44-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "choose-window-2.1.2",
    "app": "choose-window",
    "version": "2.1.2",
    "recordedOn": "2026-10-24",
    "notes": "홈과 저장 경로의 배치 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T15:28:43-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z",
    "sourceTag": "app-v2.1.2",
    "sourceSha": "aee58a1039bd1c758f94d2775cdc22c9c7b9544a"
  },
  {
    "id": "diairy-1.9.3",
    "app": "diairy",
    "version": "1.9.3",
    "sourceTag": "app-v1.9.3",
    "sourceSha": "1e8c654530a6bca06c6024a29b1eca1da2a986a4",
    "recordedOn": "2026-10-24",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T19:03:29-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "burntok-1.7.4",
    "app": "burntok",
    "version": "1.7.4",
    "recordedOn": "2026-10-24",
    "notes": "약관 동의와 사진 보기 흐름을 개선하고 프로필 아바타 생성 및 공통 화면 동작을 안정화했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T16:54:32-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z",
    "sourceTag": "app-v1.7.4",
    "sourceSha": "28bc5ab7afcd5d0d24e4d23623a71494ee00cf63"
  },
  {
    "id": "spint-1.3.2",
    "app": "spint",
    "version": "1.3.2",
    "sourceTag": "app-v1.3.2",
    "sourceSha": "a4b53609c4052df7d616dea3735d1c3d4ccc3e32",
    "recordedOn": "2026-10-24",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T17:16:28-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "utilverse-1.2.2",
    "app": "utilverse",
    "version": "1.2.2",
    "recordedOn": "2026-10-24",
    "notes": "홈 화면의 불필요한 세로 스크롤을 없애고 사진 보기, 글자 추출과 파일 저장의 안정성을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-31"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T18:13:20-07:00",
    "storeObservedAt": "2026-10-31T00:10:47.141Z"
  },
  {
    "id": "unairplane-1.1.5",
    "app": "unairplane",
    "version": "1.1.5",
    "recordedOn": "2026-10-24",
    "notes": "여정 화면 전환과 탑승권 스캔 권한 안내 및 공통 화면 동작을 개선했습니다.",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-23T14:57:29-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z",
    "sourceTag": "app-v1.1.5",
    "sourceSha": "8b9f3109fc0d541de1c36495108a23e6be812062"
  },
  {
    "id": "yajalal-2.2.1",
    "app": "yajalal",
    "version": "2.2.1",
    "recordedOn": "2026-10-23",
    "notes": "선수 사진 보기와 라인업·분석 화면의 표시 및 공통 화면 동작을 개선했습니다.",
    "sourceTag": "app-v2.2.1",
    "sourceSha": "21c221586964208b433e546627a16040d07bcfd2",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T16:05:09-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "choose-window-2.1.1",
    "app": "choose-window",
    "version": "2.1.1",
    "recordedOn": "2026-10-23",
    "notes": "홈과 저장 경로의 배치 및 공통 화면 동작을 개선했습니다.",
    "sourceTag": "app-v2.1.1",
    "sourceSha": "fef946b279cd80e0ff3762269fab7921e7ee5395",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T16:52:40-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "diairy-1.9.2",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "app": "diairy",
    "version": "1.9.2",
    "sourceTag": "app-v1.9.2",
    "sourceSha": "3d5f9b433fc90bffa79411c4549382ea296cb4b2",
    "recordedOn": "2026-10-23",
    "notes": "손글씨 미리보기와 공통 화면 동작을 개선했습니다.",
    "storeMetadataCreatedAt": "2026-10-22T17:29:04-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "burntok-1.7.3",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "app": "burntok",
    "version": "1.7.3",
    "sourceTag": "app-v1.7.3",
    "sourceSha": "edc5f8644a6b0a579c2bda1e215acbabdef96c39",
    "recordedOn": "2026-10-23",
    "notes": "약관 동의와 사진 보기 흐름을 개선하고 프로필 아바타 생성 및 공통 화면 동작을 안정화했습니다.",
    "storeMetadataCreatedAt": "2026-10-22T17:52:00-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "spint-1.3.1",
    "app": "spint",
    "version": "1.3.1",
    "recordedOn": "2026-10-23",
    "notes": "글 작성과 마크 사진 보기 및 공통 화면 동작을 개선했습니다.",
    "sourceTag": "app-v1.3.1",
    "sourceSha": "f234fb258f4f72d0fcf5a09a33d6eb61ee2d4153",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T15:25:10-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "utilverse-1.2.1",
    "app": "utilverse",
    "version": "1.2.1",
    "recordedOn": "2026-10-23",
    "notes": "홈 화면의 불필요한 세로 스크롤을 없애고 사진 보기, 글자 추출과 파일 저장의 안정성을 개선했습니다.",
    "sourceTag": "app-v1.2.1",
    "sourceSha": "18931f9463819f43e77844fb609278f7b39ca0d9",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T18:10:26-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "unairplane-1.1.4",
    "app": "unairplane",
    "version": "1.1.4",
    "recordedOn": "2026-10-23",
    "notes": "여정 화면 전환과 탑승권 스캔 권한 안내 및 공통 화면 동작을 개선했습니다.",
    "sourceTag": "app-v1.1.4",
    "sourceSha": "e22a38d0b592d061fa4d00a682852d16666ce4f5",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-26"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T15:43:28-07:00",
    "storeObservedAt": "2026-10-26T00:04:05.583Z"
  },
  {
    "id": "diairy-1.9.1",
    "app": "diairy",
    "version": "1.9.1",
    "recordedOn": "2026-10-22",
    "notes": "설정에서 개인정보 보관 기간 변경 안내를 확인할 수 있습니다.",
    "sourceTag": "app-v1.9.1",
    "sourceSha": "a7a57ce00b58534de8b44305c97c2e7b5a9b6eb7",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-22T00:24:03-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "burntok-1.7.2",
    "app": "burntok",
    "version": "1.7.2",
    "recordedOn": "2026-10-22",
    "notes": "로그인 화면의 문서 로딩 오류를 수정하고 현재 동의할 문서를 확인할 수 있도록 개선했습니다.",
    "sourceTag": "app-v1.7.2",
    "sourceSha": "80b61a3293155cefa7dc09e8317c572a96448e1e",
    "notesSource": "app-store",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "review",
        "asOf": "2026-10-22"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-21T23:31:41-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "burntok-1.7.1",
    "app": "burntok",
    "version": "1.7.1",
    "recordedOn": "2026-10-22",
    "notes": "동의할 문서의 현재 버전과 전문을 확인할 수 있도록 동의 화면을 개선했습니다.",
    "sourceTag": "app-v1.7.1",
    "sourceSha": "cf6b9e4d6fd7f931f66f6f34fc52c04920e4698e",
    "notesSource": "manifest",
    "platforms": []
  },
  {
    "id": "yajalal-2.2.0",
    "app": "yajalal",
    "version": "2.2.0",
    "recordedOn": "2026-10-21",
    "notes": "경기와 기록 화면의 간격과 버튼을 다듬어 정보를 더 편하게 확인할 수 있도록 개선했어요.",
    "sourceTag": "app-v2.2.0",
    "sourceSha": "a9cc779d8b77fe8996ca59507dc62dbc3cc5722c",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "review",
        "asOf": "2026-10-21"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T22:31:46-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "choose-window-2.1.0",
    "app": "choose-window",
    "version": "2.1.0",
    "recordedOn": "2026-10-21",
    "notes": "지도·검색·저장 화면의 버튼과 간격을 정리했어요. 경로 확인과 저장 장소 이용 흐름을 다듬고 공통 화면 동작의 안정성을 개선했어요.",
    "sourceTag": "app-v2.1.0",
    "sourceSha": "a0931857df5863060fac39d952f2f7c39293c80f",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "review",
        "asOf": "2026-10-21"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T08:58:42-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "choose-window-2.0.1",
    "app": "choose-window",
    "version": "2.0.1",
    "recordedOn": "2026-10-21",
    "notes": "앱을 React Native 기반으로 새롭게 구성했어요. 지도에서 출발지와 도착지를 고르고, 출발 시각별 경로와 창가 햇빛 방향을 더 편하게 비교할 수 있어요.",
    "sourceTag": "app-v2.0.1",
    "sourceSha": "cccca71eb633eb926851a980dc688a1a907e9ee8",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.9.0",
    "app": "diairy",
    "version": "1.9.0",
    "recordedOn": "2026-10-21",
    "notes": "편지와 설정 화면의 여백과 버튼을 다듬어 내용을 더 편하게 확인할 수 있도록 개선했어요.",
    "sourceTag": "app-v1.9.0",
    "sourceSha": "3d617ac11cb96e795cd2aafbd485a13585f646f6",
    "platforms": [
      {
        "platform": "android",
        "status": "review",
        "asOf": "2026-10-21"
      },
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-24"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T20:15:09-07:00",
    "storeObservedAt": "2026-10-24T00:09:03.770Z"
  },
  {
    "id": "burntok-1.7.0",
    "app": "burntok",
    "version": "1.7.0",
    "recordedOn": "2026-10-21",
    "notes": "홈과 프로필, 팔로워 목록의 화면을 더 보기 편하게 다듬었어요. 검색과 알림, 댓글의 사용성을 개선하고 뚝을 만들고 수정하는 과정의 안정성을 높였습니다.",
    "sourceTag": "app-v1.7.0",
    "sourceSha": "40378f0229d6d7b37e5082799aea08bb0a23993a",
    "platforms": [
      {
        "platform": "android",
        "status": "submitted",
        "asOf": "2026-10-21"
      },
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T18:40:39-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.3.0",
    "app": "spint",
    "version": "1.3.0",
    "recordedOn": "2026-10-21",
    "notes": "지도와 기록 작성 화면의 버튼과 안내 표시를 다듬고, 화면 간격을 개선했어요.",
    "sourceTag": "app-v1.3.0",
    "sourceSha": "86d9f942c3d3aa3d898461a1919025d10d595254",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "internal",
        "asOf": "2026-10-21"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T21:06:44-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "utilverse-1.2.0",
    "app": "utilverse",
    "version": "1.2.0",
    "recordedOn": "2026-10-21",
    "notes": "Google 로그인을 선택해 회원 기능을 이용할 수 있습니다. iOS에서는 Apple 로그인도 선택할 수 있습니다. 닉네임 등록, 약관·개인정보 안내와 계정 탈퇴·데이터 삭제 기능을 추가했습니다. 기존 기기 도구는 회원 가입 없이 계속 사용할 수 있습니다. 앱 시작 안정성을 개선하고 도구함 탐색 동작을 다듬었습니다.",
    "sourceTag": "app-v1.2.0",
    "sourceSha": "5e339aee4843d7ddcb67f86b14ec73ee9ad5b004",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "closed-review",
        "asOf": "2026-10-21"
      }
    ],
    "storeMetadataCreatedAt": "2026-10-12T17:18:42-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z",
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-2.0.0",
    "app": "choose-window",
    "version": "2.0.0",
    "recordedOn": "2026-10-20",
    "notes": "앱을 React Native 기반으로 새롭게 구성했어요. 지도에서 출발지와 도착지를 고르고, 출발 시각별 경로와 창가 햇빛 방향을 더 편하게 비교할 수 있어요.",
    "sourceTag": "app-v2.0.0",
    "sourceSha": "eb7a898a1472aea57464744e9e49749269d00cf7",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T04:05:13-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.1.3",
    "app": "unairplane",
    "version": "1.1.3",
    "recordedOn": "2026-10-20",
    "notes": "여정 카드의 상세 보기 화살표와 삭제 버튼을 분리하고, 홈 안내 문구를 간결하게 다듬었어요.",
    "sourceTag": "app-v1.1.3",
    "sourceSha": "4d626b8ac63808e91a9c0abfccaaf9e6960a1514",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-25"
      },
      {
        "platform": "android",
        "status": "submitted",
        "asOf": "2026-10-21"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-20T07:59:16-07:00",
    "storeObservedAt": "2026-10-25T00:01:04.992Z"
  },
  {
    "id": "utilverse-1.1.0",
    "app": "utilverse",
    "version": "1.1.0",
    "recordedOn": "2026-10-20",
    "notes": "생활 도구 화면과 메뉴 사용성을 개선하고 앱 디자인을 정리했습니다.",
    "sourceTag": "app-v1.1.0",
    "sourceSha": "71ed2c376fd2786c400225a52ea1426d4e7eb5fe",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-2.1.1",
    "app": "yajalal",
    "version": "2.1.1",
    "recordedOn": "2026-10-17",
    "notes": "리그 전환을 아이콘 버튼으로 개선하고 기록실의 불필요한 팀 순위 버튼을 정리했습니다.",
    "sourceTag": "app-v2.1.1",
    "sourceSha": "017aedc89618a6fc0e9e22866fa588733faf5e84",
    "platforms": [
      {
        "platform": "android",
        "status": "available",
        "asOf": "2026-10-21"
      },
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-24"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-16T18:53:53-07:00",
    "storeObservedAt": "2026-10-24T00:09:03.770Z"
  },
  {
    "id": "unairplane-1.1.2",
    "app": "unairplane",
    "version": "1.1.2",
    "recordedOn": "2026-10-17",
    "notes": "여정 카드의 상세 보기 화살표와 삭제 버튼을 분리하고, 홈 안내 문구를 간결하게 다듬었어요.",
    "sourceTag": "app-v1.1.2",
    "sourceSha": "043349b1c73f190ab48174c339ea3752c1fcc5d5",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-16T16:47:21-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-2.1.0",
    "app": "yajalal",
    "version": "2.1.0",
    "recordedOn": "2026-10-16",
    "notes": "구단 순위표와 일정·기록 화면을 더 보기 쉽게 다듬었습니다. 이적·FA 계약 평가 화면을 새로 구성하고, FA 예정 선수 표시와 최근 경기 홈/원정 표시를 개선했습니다. 앱 개선을 위한 사용 통계를 수집하며 설정에서 끌 수 있습니다.",
    "sourceTag": "app-v2.1.0",
    "sourceSha": "6ebc69bebd393b6050d111cc5386df447e4c6f52",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-15T21:00:25-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-2.0.0",
    "app": "yajalal",
    "version": "2.0.0",
    "recordedOn": "2026-10-15",
    "notes": "오늘야구로 새롭게 바뀌었습니다. 새 아이콘과 화면 구성, 선수·팀 기록 비교, FA·트레이드 추적을 개선하고 기존 즐겨찾기와 기록을 이어서 사용할 수 있도록 했습니다.",
    "sourceTag": "app-v2.0.0",
    "sourceSha": "d74dc2b18de17502a61e0e5ce2f8302c128b26e9",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-15T03:42:57-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.2.1",
    "app": "spint",
    "version": "1.2.1",
    "recordedOn": "2026-10-15",
    "notes": "10개 언어를 지원하고 설정의 언어 선택을 더 편하게 다듬었어요. 알림을 선택한 언어로 보내고, 사용 통계 수집을 설정에서 끌 수 있도록 추가했어요.",
    "sourceTag": "app-v1.2.1",
    "sourceSha": "a375bd212b3034d6a26ad9af628041e809e2cea5",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-24"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-15T00:20:59-07:00",
    "storeObservedAt": "2026-10-24T00:09:03.770Z"
  },
  {
    "id": "unairplane-1.1.1",
    "app": "unairplane",
    "version": "1.1.1",
    "recordedOn": "2026-10-15",
    "notes": "탑승권 스캔의 첫 카메라 권한 안내를 개선했어요. 계속을 누르면 시스템 권한창이 열리고, 권한을 거절한 뒤에도 사진 가져오기와 편명 등록을 이용할 수 있어요.",
    "sourceTag": "app-v1.1.1",
    "sourceSha": "06f3d2a6cd6d16166569b59f33db29c2571584e5",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-15T06:04:03-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.2.0",
    "app": "spint",
    "version": "1.2.0",
    "recordedOn": "2026-10-14",
    "notes": "10개 언어를 지원하고 설정의 언어 선택을 더 편하게 다듬었어요. 알림을 선택한 언어로 보내고, 사용 통계 수집을 설정에서 끌 수 있도록 추가했어요.",
    "sourceTag": "app-v1.2.0",
    "sourceSha": "c68a78213e2e19b3dd8f8d43333f84295ddfb3bd",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-13T09:19:20-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "utilverse-1.0.1",
    "app": "utilverse",
    "version": "1.0.1",
    "recordedOn": "2026-10-13",
    "notes": "Utilverse 1.0.0 첫 비공개 테스트입니다.",
    "sourceTag": "app-v1.0.1",
    "sourceSha": "b9791369d6c8a19281dbc104b93a6d2d83dab765",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "utilverse-1.0.0",
    "app": "utilverse",
    "version": "1.0.0",
    "recordedOn": "2026-10-13",
    "notes": "Utilverse 1.0.0 첫 비공개 테스트입니다.",
    "sourceTag": "app-v1.0.0",
    "sourceSha": "c20f4b821889002d81890e42d7f1b78764f4f166",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.8.0",
    "app": "diairy",
    "version": "1.8.0",
    "recordedOn": "2026-10-12",
    "notes": "편지와 여정에 함께하는 동물 친구 46종의 모습을 새롭게 다듬었어요.",
    "sourceTag": "app-v1.8.0",
    "sourceSha": "ca9a76e983646b7ab49e3d2d4c474630942dd111",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-11T22:44:10-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.6.2",
    "app": "burntok",
    "version": "1.6.2",
    "recordedOn": "2026-10-12",
    "notes": "홈과 프로필, 팔로워 목록의 화면을 더 보기 편하게 다듬었어요. 검색과 알림, 댓글의 사용성을 개선하고 뚝을 만들고 수정하는 과정의 안정성을 높였습니다.",
    "sourceTag": "app-v1.6.2",
    "sourceSha": "cea748c8f14d27ef4f9638e091e12d94edf5cd16",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-11T23:33:22-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.6.1",
    "app": "burntok",
    "version": "1.6.1",
    "recordedOn": "2026-10-09",
    "notes": "홈과 프로필, 팔로워 목록의 화면을 더 보기 편하게 다듬었어요. 검색과 알림, 댓글의 사용성을 개선하고 뚝을 만들고 수정하는 과정의 안정성을 높였습니다.",
    "sourceTag": "app-v1.6.1",
    "sourceSha": "a598cca68bc7d8d7ba3169d044de4e937cd03f72",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-09T05:50:47-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.1.0",
    "app": "unairplane",
    "version": "1.1.0",
    "recordedOn": "2026-10-09",
    "notes": "편명과 탑승권으로 항공편 일정을 찾아 바로 저장할 수 있어요. 홈과 진행 중·예정 카드에서 비행 진행률과 출발·도착까지 남은 시간을 확인하세요. 검색 로딩과 여정 화면, 위젯 배치를 개선했습니다.",
    "sourceTag": "app-v1.1.0",
    "sourceSha": "b30f51ae51971a4131592e4632ce9a09382fb8db",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-09T06:52:37-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.1.0",
    "app": "spint",
    "version": "1.1.0",
    "recordedOn": "2026-10-09",
    "notes": "10개 언어를 지원하고 설정의 언어 선택을 더 편하게 다듬었어요. 알림을 선택한 언어로 보내고, 사용 통계 수집을 설정에서 끌 수 있도록 추가했어요.",
    "sourceTag": "app-v1.1.0",
    "sourceSha": "f0e48c4ca4657e386d882c2767af343bb4f1362b",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-08T20:23:14-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.6.0",
    "app": "diairy",
    "version": "1.6.0",
    "recordedOn": "2026-10-08",
    "notes": "내 글씨체로 편지를 보낼 수 있어요. 준비된 글씨체를 고르거나 직접 쓴 한글·글자 사진으로 개인 글씨체를 만들고, 받는 사람도 같은 필체로 읽을 수 있어요. 지원 언어를 늘리고 답장 보내기, 편지 여정, 글씨체 선택과 화면 안내를 다듬었어요.",
    "sourceTag": "app-v1.6.0",
    "sourceSha": "2e88027bd83c463c340f5cded38d74d354625806",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-08T04:58:18-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.6.0",
    "app": "burntok",
    "version": "1.6.0",
    "recordedOn": "2026-10-08",
    "notes": "홈과 프로필, 팔로워 목록의 화면을 더 보기 편하게 다듬었어요. 검색과 알림, 댓글의 사용성을 개선하고 뚝을 만들고 수정하는 과정의 안정성을 높였습니다.",
    "sourceTag": "app-v1.6.0",
    "sourceSha": "cb01599bc85343479e80c42b52800d2f9bc108a9",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-07T21:47:15-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.5.2",
    "app": "diairy",
    "version": "1.5.2",
    "recordedOn": "2026-10-05",
    "notes": "내 글씨체로 편지를 보낼 수 있어요. 준비된 글씨체를 고르거나 직접 쓴 한글·글자 사진으로 개인 글씨체를 만들고, 받는 사람도 같은 필체로 읽을 수 있어요. 지원 언어를 늘리고 답장 보내기, 편지 여정, 글씨체 선택과 화면 안내를 다듬었어요.",
    "sourceTag": "app-v1.5.2",
    "sourceSha": "ad6ce184dd0c849e7631a565a10f191ed495ccab",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.5.1",
    "app": "burntok",
    "version": "1.5.1",
    "recordedOn": "2026-10-03",
    "notes": "공유할 때 뚝 아이콘이 바로 보여요. 뚝을 만드는 과정과 완료 안내를 다듬고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.5.1",
    "sourceSha": "ad6f12aa6d95890b3acb00747b2a1ea0c75f24d2",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-02T23:13:38-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.4.2",
    "app": "diairy",
    "version": "1.4.2",
    "recordedOn": "2026-10-03",
    "notes": "편지 여정과 둥지 화면을 다듬고, 스탬프 종류를 늘렸어요. 가입할 때 달팽이 프로필로 시작하고, 동물 도감에서 얻은 친구를 프로필로 고를 수 있어요. 편지는 5자부터 300자까지 쓸 수 있어요. 지도와 위젯의 상태 안내 및 앱 안정성을 개선했어요.",
    "sourceTag": "app-v1.4.2",
    "sourceSha": "c7db36cf73d41d70f90dda07db740b7d52d2a1af",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-02T22:01:19-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.0.4",
    "app": "spint",
    "version": "1.0.4",
    "recordedOn": "2026-10-03",
    "notes": "로그인 화면을 더 간결하게 다듬고 로그인 중 카드 표시를 개선했어요. 오늘의 들판을 확인하는 홈·잠금화면 위젯을 추가하고 화면 배치를 안정화했어요.",
    "sourceTag": "app-v1.0.4",
    "sourceSha": "362fbee4622004a62229f588685821b2df5bb7a5",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-03T00:22:08-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.5.0",
    "app": "burntok",
    "version": "1.5.0",
    "recordedOn": "2026-10-02",
    "notes": "뚝에서 만든 엑셀·이미지·PDF 같은 파일을 기기에 저장하고, 내 파일을 뚝에 넣어 쓸 수 있어요. 압축된 3D 모델도 열 수 있고, 지도·3D·문서 도구가 더 많아졌어요. 안정성도 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-02T03:46:18-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.3.1",
    "app": "diairy",
    "version": "1.3.1",
    "recordedOn": "2026-10-02",
    "notes": "가입할 때 무작위 닉네임과 동물 프로필을 받아요. 닉네임은 가입 중 편집할 수 있고, 프로필 동물은 설정에서 최대 세 번 바꿀 수 있어요. 편지가 닿는 나라에 따라 그 지역에서만 만나는 동물 친구 18종이 생겼고, 로그인 화면과 편지 여정도 다듬었어요.",
    "sourceTag": "app-v1.3.1",
    "sourceSha": "070b78ae3c23781716ef815cdd3a4662fdc75c4e",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-02T01:57:48-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.14",
    "app": "unairplane",
    "version": "1.0.14",
    "recordedOn": "2026-10-02",
    "notes": "공항 검색이 더 빨라지고, 검색 결과를 넘길 때 화면이 더 매끄럽게 스크롤돼요.",
    "sourceTag": "app-v1.0.14",
    "sourceSha": "33ba068789beb68502527310f1fcd59169176b87",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-10-01T23:01:08-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.0.2",
    "app": "spint",
    "version": "1.0.2",
    "recordedOn": "2026-10-01",
    "notes": "첫 화면과 탐험 안내, 꽃 남기기 단계와 이모지 카드, 설정 화면을 개선했어요. 위치 권한 반영과 자동 갱신, 알림·답글 및 재시도 동작을 다듬었어요.",
    "sourceTag": "app-v1.0.2",
    "sourceSha": "e936497272c93a4f9e7601307e8690a3293701d9",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-30T19:48:25-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.4.1",
    "app": "burntok",
    "version": "1.4.1",
    "recordedOn": "2026-09-30",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.4.1",
    "sourceSha": "c2cf627c27c83a51e65972608fa08d43dac39ecf",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-29T17:09:03-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.4.0",
    "app": "burntok",
    "version": "1.4.0",
    "recordedOn": "2026-09-30",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.4.0",
    "sourceSha": "3ca30423b75360514eb035526cf208ce889e34b2",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-1.3.4",
    "app": "choose-window",
    "version": "1.3.4",
    "recordedOn": "2026-09-30",
    "notes": "대중교통 경로 카드 아래에서 왼쪽·오른쪽·양쪽 비슷의 전체 햇빛 비율을 가로 막대와 퍼센트로 확인할 수 있어요.",
    "sourceTag": "app-v1.3.4+21",
    "sourceSha": "a9a869b1f5eb33d22aadd64046c0d0b8485791d8",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-1.3.3",
    "app": "choose-window",
    "version": "1.3.3",
    "recordedOn": "2026-09-30",
    "notes": "KTX·시외버스 같은 장거리 대중교통 경로를 다시 찾을 수 있어요. 경로를 누르면 바로 어느 쪽 창가에 앉을지 알려 주고, 대중교통은 구간별로 추천해요. 결과는 이미지로 공유할 수 있고, 경로 카드와 저장한 장소 화면도 보기 쉽게 다듬었어요.",
    "sourceTag": "app-v1.3.3+20",
    "sourceSha": "8b747f5a441763783e7d87f4e903ccf83e2fa8be",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-29T09:23:20-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.2.2",
    "app": "diairy",
    "version": "1.2.2",
    "recordedOn": "2026-09-30",
    "notes": "다에리가 구름 우체국 섬으로 새로 단장했어요. 매일 바뀌는 동물 우체부가 말을 걸어 주고, 새 음악과 동물 목소리가 함께해요. 도감은 등급별로 보기 쉬워졌고, 받을 회원이 없는 비공개 편지는 그 나라 어딘가에 조용히 내려앉아요.",
    "sourceTag": "app-v1.2.2",
    "sourceSha": "85d7f00fa53f9b5542808c752fbe60356640ac9b",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-28T03:41:15-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.2.1",
    "app": "diairy",
    "version": "1.2.1",
    "recordedOn": "2026-09-30",
    "notes": "다에리가 구름 우체국 섬으로 새로 단장했어요. 매일 바뀌는 동물 우체부가 말을 걸어 주고, 새 음악과 동물 목소리가 함께해요. 도감은 등급별로 보기 쉬워졌고, 받을 회원이 없는 비공개 편지는 그 나라 어딘가에 조용히 내려앉아요.",
    "sourceTag": "app-v1.2.1",
    "sourceSha": "e2b20c079fab01906f165821fbf2e4823c40e556",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "spint-1.0.1",
    "app": "spint",
    "version": "1.0.1",
    "recordedOn": "2026-09-30",
    "notes": "첫 화면과 탐험 안내, 꽃 남기기 단계와 이모지 카드, 설정 화면을 개선했어요. 위치 권한 반영과 자동 갱신, 알림·답글 및 재시도 동작을 다듬었어요.",
    "sourceTag": "app-v1.0.1",
    "sourceSha": "2bc2f0e422bad8d9829e3b14127964758366a6a6",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.3.0",
    "app": "burntok",
    "version": "1.3.0",
    "recordedOn": "2026-09-29",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-28T08:33:17-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.2.0",
    "app": "diairy",
    "version": "1.2.0",
    "recordedOn": "2026-09-29",
    "notes": "다에리가 구름 우체국 섬으로 새로 단장했어요. 매일 바뀌는 동물 우체부가 말을 걸어 주고, 새 음악과 동물 목소리가 함께해요. 도감은 등급별로 보기 쉬워졌고, 받을 회원이 없는 비공개 편지는 그 나라 어딘가에 조용히 내려앉아요.",
    "sourceTag": "app-v1.2.0",
    "sourceSha": "2f4c218b0f02934d55f200179b4c6134b3a78078",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.1.0",
    "app": "diairy",
    "version": "1.1.0",
    "recordedOn": "2026-09-28",
    "notes": "다에리가 구름 우체국 섬으로 새로 단장했어요. 매일 바뀌는 동물 우체부가 말을 걸어 주고, 새 음악과 동물 목소리가 함께해요. 도감은 등급별로 보기 쉬워졌고, 받을 회원이 없는 비공개 편지는 그 나라 어딘가에 조용히 내려앉아요.",
    "sourceTag": "app-v1.1.0",
    "sourceSha": "f8ae9b12119f06136135d63d73d1178edc2dde70",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "unairplane-1.0.13",
    "app": "unairplane",
    "version": "1.0.13",
    "recordedOn": "2026-09-28",
    "notes": "첫 화면을 다시 구성해 오프라인 안내와 여정 상태, 탑승권 스캔·직접 등록을 한눈에 볼 수 있어요.",
    "sourceTag": "app-v1.0.13",
    "sourceSha": "77bfa5888ee1f660d4f9e958a739d168d8653f18",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-27T08:38:19-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.12",
    "app": "unairplane",
    "version": "1.0.12",
    "recordedOn": "2026-09-28",
    "notes": "첫 화면을 다시 구성해 오프라인 안내와 여정 상태, 탑승권 스캔·직접 등록을 한눈에 볼 수 있어요.",
    "sourceTag": "app-v1.0.12",
    "sourceSha": "7d06951a9fee37665110c033ccf2f6e1293d611c",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "unairplane-1.0.11",
    "app": "unairplane",
    "version": "1.0.11",
    "recordedOn": "2026-09-28",
    "notes": "저장한 여정을 먼저 확인하고 공항을 한글로 검색할 수 있어요. 탑승권 사진 가져오기, 날짜 수정, 이륙·남은 시간 보정, 비행 완료와 다크 모드를 추가하고 저장 오류 안내를 개선했습니다.",
    "sourceTag": "app-v1.0.11",
    "sourceSha": "75f25fe1187d450fc18a19a4452e44645268dc04",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.10",
    "app": "diairy",
    "version": "1.0.10",
    "recordedOn": "2026-09-28",
    "notes": "작은 바닷가 우체국처럼 화면을 새로 꾸몄어요. 나라를 엽서처럼 고르고, 둥지 정원에서 친구에게 인사할 수 있어요. 편지는 현재 위치에서 출발하도록 위치 확인 안내를 더 친절하게 바꿨어요.",
    "sourceTag": "app-v1.0.10",
    "sourceSha": "5a507eee4b970ff6684af1841b6f62393b55200b",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.8",
    "app": "yajalal",
    "version": "1.21.8",
    "recordedOn": "2026-09-27",
    "notes": "앱 아이콘을 새로 바꾸고, 랭킹 필터와 스탯 버튼을 이전의 익숙한 모양으로 되돌렸습니다. 필터 조건은 버튼 하나로 정리했습니다.",
    "sourceTag": "app-v1.21.8+84",
    "sourceSha": "d4f41a65892d43e399f3cd72f51f069d2db8d971",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-26T08:47:09-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.21.7",
    "app": "yajalal",
    "version": "1.21.7",
    "recordedOn": "2026-09-27",
    "notes": "랭킹 필터와 스탯 버튼을 이전의 익숙한 모양으로 되돌리고, 필터 조건을 버튼 하나로 정리했습니다.",
    "sourceTag": "app-v1.21.7+82",
    "sourceSha": "9db78590119039be5401957411211befbd00c133",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-1.3.2",
    "app": "choose-window",
    "version": "1.3.2",
    "recordedOn": "2026-09-27",
    "notes": "KTX·시외버스 같은 장거리 대중교통 경로를 다시 찾을 수 있어요. 경로를 누르면 바로 어느 쪽 창가에 앉을지 알려 주고, 대중교통은 구간별로 추천해요. 결과는 이미지로 공유할 수 있고, 경로 카드와 저장한 장소 화면도 보기 쉽게 다듬었어요.",
    "sourceTag": "app-v1.3.2+19",
    "sourceSha": "3a01e148610b614cc9f23908a2043b9e14084fcc",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-26T17:51:42-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.3.1",
    "app": "choose-window",
    "version": "1.3.1",
    "recordedOn": "2026-09-27",
    "notes": "KTX·시외버스 같은 장거리 대중교통 경로를 다시 찾을 수 있어요. 경로를 누르면 바로 어느 쪽 창가에 앉을지 알려 주고, 대중교통은 구간별로 추천해요. 결과는 이미지로 공유할 수 있고, 결과 화면과 저장한 장소 관리 화면도 보기 쉽게 다듬었어요.",
    "sourceTag": "app-v1.3.1+18",
    "sourceSha": "f9516b0ea792a2798d3d9a23c4058b58e165d2d2",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-1.3.0",
    "app": "choose-window",
    "version": "1.3.0",
    "recordedOn": "2026-09-27",
    "notes": "시작 화면에 계절감을 담은 눈사람 애니메이션을 추가했습니다.",
    "sourceTag": "app-v1.3.0+17",
    "sourceSha": "6dfc9d009908bedfed7dcce6ba09274af5fe60ad",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-26T12:02:55-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.2.0",
    "app": "burntok",
    "version": "1.2.0",
    "recordedOn": "2026-09-27",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.2.0",
    "sourceSha": "becc83ede3110f6443c3a226b6e6d2124bc32781",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-26T13:40:24-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "spint-1.0.0",
    "app": "spint",
    "version": "1.0.0",
    "recordedOn": "2026-09-27",
    "notes": "Spint의 첫 번째 들판입니다. 서 있는 자리에 꽃을 남기고, 세계 곳곳에 핀 꽃을 읽어 보세요.",
    "sourceTag": "app-v1.0.0",
    "sourceSha": "402b8a8e85224ded02ddcd384d2d89c4d2944e8c",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "storeMetadataCreatedAt": "2026-09-26T10:19:53-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z",
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.9",
    "app": "diairy",
    "version": "1.0.9",
    "recordedOn": "2026-09-26",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.9",
    "sourceSha": "84f2ece187890dac3ea203b7ed2a51a6eee2751e",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "storeMetadataCreatedAt": "2026-09-10T18:44:18-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z",
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.6",
    "app": "yajalal",
    "version": "1.21.6",
    "recordedOn": "2026-09-25",
    "notes": "앱 시작 안정성을 개선했습니다.",
    "sourceTag": "app-v1.21.6+81",
    "sourceSha": "78bb442c40e3c443decfcafddbd002806a68c7b8",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-23T06:34:03-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.2.0",
    "app": "choose-window",
    "version": "1.2.0",
    "recordedOn": "2026-09-25",
    "notes": "대중교통 경로를 카카오맵 기반으로 바꾸고, 출발지와 도착지까지 걷는 구간도 함께 보여줍니다.",
    "sourceTag": "app-v1.2.0+16",
    "sourceSha": "07c112c8aaf993758c520ebe385f07a62d96b053",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-25T02:49:58-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.0.8",
    "app": "diairy",
    "version": "1.0.8",
    "recordedOn": "2026-09-24",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.8",
    "sourceSha": "a8e9fdb735675ebf227741677f31b1a16d8f1f35",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.7",
    "app": "diairy",
    "version": "1.0.7",
    "recordedOn": "2026-09-24",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.7",
    "sourceSha": "09f58bcccb28939a48542a993455f6856a3c956e",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.5",
    "app": "yajalal",
    "version": "1.21.5",
    "recordedOn": "2026-09-23",
    "notes": "랭킹 필터와 오류·로딩 화면을 개선하고, 야구공 비행 스플래시를 추가했습니다.",
    "sourceTag": "app-v1.21.5+80",
    "sourceSha": "3b2c98dd7a1d6faea0464c53f42761b1827f67e4",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "choose-window-1.1.9",
    "app": "choose-window",
    "version": "1.1.9",
    "recordedOn": "2026-09-23",
    "notes": "시작 화면에 계절감을 담은 눈사람 애니메이션을 추가했습니다.",
    "sourceTag": "app-v1.1.9+15",
    "sourceSha": "d6113f25dc62cb8997246a7a2ef03dbf2ddeb1dc",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-23T08:31:16-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.1.0",
    "app": "burntok",
    "version": "1.1.0",
    "recordedOn": "2026-09-23",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.1.0",
    "sourceSha": "fea20291cf1c0a4f7132f96b72c917e87ab091cc",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-22T21:09:07-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.0.6",
    "app": "diairy",
    "version": "1.0.6",
    "recordedOn": "2026-09-23",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.6",
    "sourceSha": "f44f6411f67937112c39e2abbd95728fe2b74813",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.9",
    "app": "burntok",
    "version": "1.0.9",
    "recordedOn": "2026-09-21",
    "notes": "프로필 만들기 화면을 '나중에'로 넘겨도 로그인할 때마다 다시 나오지 않습니다.",
    "sourceTag": "app-v1.0.9",
    "sourceSha": "79d2a79978cf7e8ad119e84493a306f88f0bd399",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-20T19:12:46-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.0.5",
    "app": "diairy",
    "version": "1.0.5",
    "recordedOn": "2026-09-21",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.5",
    "sourceSha": "2da9f5332d10989525a6a02b34c8ee956312750c",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.3",
    "app": "yajalal",
    "version": "1.21.3",
    "recordedOn": "2026-09-20",
    "notes": "앱을 열 때 나오는 시작 화면에 움직임을 더했습니다. 오류가 났을 때 나오는 다시 불러오기를 누르기 쉽게 고쳤습니다.",
    "sourceTag": "app-v1.21.3+76",
    "sourceSha": "030e90aedebbd5b5e866ac191119b6ad3354f5f9",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-19T18:01:42-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.10",
    "app": "unairplane",
    "version": "1.0.10",
    "recordedOn": "2026-09-20",
    "notes": "iOS 27에서 앱이 실행되지 않던 문제를 고쳤습니다.",
    "sourceTag": "app-v1.0.10",
    "sourceSha": "e009279bac4a20544902b03d5230a10dc6c0c8da",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-19T18:31:46-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.9",
    "app": "unairplane",
    "version": "1.0.9",
    "recordedOn": "2026-09-20",
    "notes": "앱이 예기치 않게 꺼졌을 때 원인을 모아 다음 업데이트에서 고칠 수 있게 했습니다.",
    "sourceTag": "app-v1.0.9",
    "sourceSha": "e52597f74902009f4f28f35385b2425ec2d65650",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.8",
    "app": "burntok",
    "version": "1.0.8",
    "recordedOn": "2026-09-20",
    "notes": "iOS 27에서 앱이 실행되지 않던 문제를 고쳤습니다. 로그인 버튼에 카카오·네이버·구글·Apple 로고가 들어갔고, 앱을 열 때 나오는 시작 화면에 번뜩이는 움직임을 더했습니다.",
    "sourceTag": "app-v1.0.8",
    "sourceSha": "bfa6af1d7e742b57fe667d37693a904cea7d3226",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-19T19:06:06-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "burntok-1.0.6",
    "app": "burntok",
    "version": "1.0.6",
    "recordedOn": "2026-09-19",
    "notes": "로그인 버튼에 카카오·네이버·구글·Apple 로고가 들어갔습니다. 앱을 열 때 나오는 시작 화면에 번뜩이는 움직임을 더했습니다.",
    "sourceTag": "app-v1.0.6",
    "sourceSha": "0b6504ae03f50a9df187b0ec176275fd8175c06a",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.3",
    "app": "burntok",
    "version": "1.0.3",
    "recordedOn": "2026-09-18",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.0.3",
    "sourceSha": "962a725f3527cbe1e1415861b481e7f2ad977cd4",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "storeMetadataCreatedAt": "2026-09-10T02:29:30-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z",
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.2",
    "app": "burntok",
    "version": "1.0.2",
    "recordedOn": "2026-09-18",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.0.2",
    "sourceSha": "c67c419dd5fc482e2b9e57a9d5e8509560074549",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.1",
    "app": "burntok",
    "version": "1.0.1",
    "recordedOn": "2026-09-18",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.0.1",
    "sourceSha": "899ac055db90564e4df7c0300abfe5eb996464ad",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.2",
    "app": "yajalal",
    "version": "1.21.2",
    "recordedOn": "2026-09-15",
    "notes": "다이나믹 아일랜드 축소 상태의 점수가 마이팀 홈 경기에서 반대로 읽히던 문제를 고쳤습니다. 마이팀 점수가 먼저 나오고 상대 점수는 흐리게 표시합니다.",
    "sourceTag": "app-v1.21.2+75",
    "sourceSha": "e0990b1c561f95252e3406993d18d804cf5531ab",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-15T05:39:03-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.21.1",
    "app": "yajalal",
    "version": "1.21.1",
    "recordedOn": "2026-09-14",
    "notes": "앱을 열어두지 않아도 홈·잠금화면 위젯이 경기 상황에 맞춰 바로 갱신됩니다. 경기가 끝난 뒤 잠금화면과 다이나믹 아일랜드에 남아 있던 배너도 정리했습니다.",
    "sourceTag": "app-v1.21.1+74",
    "sourceSha": "d1bef3249bb4c40ffdb345caa19d08818498c2ec",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-13T23:59:49-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.8",
    "app": "unairplane",
    "version": "1.0.8",
    "recordedOn": "2026-09-14",
    "notes": "비행이 끝난 뒤 앱을 다시 열어도 잠금화면과 다이나믹 아일랜드에 남아 있던 안내를 정리했습니다.",
    "sourceTag": "app-v1.0.8",
    "sourceSha": "ec14f9d9616e4f919864d55134ed3213500b3454",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-14T00:20:58-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "diairy-1.0.3",
    "app": "diairy",
    "version": "1.0.3",
    "recordedOn": "2026-09-14",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.3",
    "sourceSha": "eef071e7f16c481537cf522755e8cf1f7f0aa62b",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.2",
    "app": "diairy",
    "version": "1.0.2",
    "recordedOn": "2026-09-14",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.2",
    "sourceSha": "ef7020fbaf129411a5ce28e599dc260bda1d732a",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.1",
    "app": "diairy",
    "version": "1.0.1",
    "recordedOn": "2026-09-13",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.1",
    "sourceSha": "e896ef38fed9f839f25f9d15b24c0804a8ec6d4b",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "diairy-1.0.0",
    "app": "diairy",
    "version": "1.0.0",
    "recordedOn": "2026-09-12",
    "notes": "다에리의 첫 번째 이야기입니다. 일기를 띄우고, 동물의 여정을 따라가고, 닿은 편지를 주워 보세요.",
    "sourceTag": "app-v1.0.0",
    "sourceSha": "056432dfca11f1bd128940113c522016eef1bf63",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "burntok-1.0.0",
    "app": "burntok",
    "version": "1.0.0",
    "recordedOn": "2026-09-11",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.0.0",
    "sourceSha": "bbdc74a54d88a70cfa271ac6e55ed8c6c442170b",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.21.0",
    "app": "yajalal",
    "version": "1.21.0",
    "recordedOn": "2026-09-10",
    "notes": "관심 선수의 홈런·멀티히트·타점·호투 알림을 추가했습니다. 3·6·9회 경기 점수를 알림으로 확인하고, 한 이닝 3점 빅이닝·5점 빅빅이닝·10점 레전드 이닝 알림을 받을 수 있습니다. 알림 설정에서 원하는 항목을 켜주세요.",
    "sourceTag": "app-v1.21.0+73",
    "sourceSha": "f6e5a499e023fc16646eea1e1b212c9b7b039e5e",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-09T19:35:18-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.20.6",
    "app": "yajalal",
    "version": "1.20.6",
    "recordedOn": "2026-09-08",
    "notes": "iOS 홈 화면과 잠금화면 위젯에 마이팀 설정이 반영되지 않던 문제를 수정했습니다.",
    "sourceTag": "app-v1.20.6+72",
    "sourceSha": "f279ce39e7336f5a92e403f4f5c6cb4a5465e744",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-08T05:16:56-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.7",
    "app": "unairplane",
    "version": "1.0.7",
    "recordedOn": "2026-09-08",
    "notes": "예정된 일정이 없을 때 위젯에 안내를 표시합니다. 완료되거나 만료된 일정을 정리하고, 위젯에서 일정 등록 화면으로 이동하는 흐름을 개선했습니다.",
    "sourceTag": "app-v1.0.7",
    "sourceSha": "6ec0afc0538eb608f384e857de1fd9aeda3f66fd",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-08T04:50:28-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.6",
    "app": "unairplane",
    "version": "1.0.6",
    "recordedOn": "2026-09-08",
    "notes": "앱과 위젯의 남은 시간을 도착 예정 시각 기준으로 통일했습니다. 저장한 일정 카드의 중복 도시명 표시를 정리하고, 시각 입력 키보드에 확인 버튼을 추가했습니다.",
    "sourceTag": "app-v1.0.6",
    "sourceSha": "db3e0858fcaf4e1729c640a50a44b4e2e341f87f",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-07T11:04:35-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.20.5",
    "app": "yajalal",
    "version": "1.20.5",
    "recordedOn": "2026-09-05",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.20.5+71",
    "sourceSha": "54fe0401f8e227d4ae0bb0b0adc97f36fbac0c32",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-06T00:30:29-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.20.4",
    "app": "yajalal",
    "version": "1.20.4",
    "recordedOn": "2026-09-05",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.20.4+70",
    "sourceSha": "da842c7d2e3b635cbfc32b410ae2299e5be77331",
    "platforms": [],
    "notesSource": "manifest"
  },
  {
    "id": "yajalal-1.20.3",
    "app": "yajalal",
    "version": "1.20.3",
    "recordedOn": "2026-09-05",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-04T19:02:14-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.4",
    "app": "unairplane",
    "version": "1.0.4",
    "recordedOn": "2026-09-05",
    "notes": "비행 중 화면을 지도 한 장으로 정리했습니다. 진행률, 지나온 곳과 지금쯤 지나는 곳, 다음 지점, 남은 시간·거리·도착 예정을 경로 지도 위와 아래에서 한눈에 볼 수 있습니다. 홈 위젯 지도의 해안선이 어두운 배경에서도 잘 보이도록 색을 고쳤습니다.",
    "sourceTag": "app-v1.0.4",
    "sourceSha": "03735b46683941f59b775978c3106d7380079053",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-05T23:48:48-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.3",
    "app": "unairplane",
    "version": "1.0.3",
    "recordedOn": "2026-09-05",
    "notes": "탑승권을 스캔하거나 노선만 입력해 여정을 먼저 등록하고, 이륙 순간을 기준으로 여정을 시작할 수 있습니다. 홈·잠금화면 위젯이 저장한 항공편을 바로 보여주고, 시각을 아직 입력하지 않은 다가오는 여정도 안내합니다. 경로 지도에 해안선이 추가되어 위치를 한눈에 볼 수 있습니다.",
    "sourceTag": "app-v1.0.3",
    "sourceSha": "ad72b1aab51e4ca7559348b6c3cc8d81cee4095d",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-04T20:33:36-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.20.1",
    "app": "yajalal",
    "version": "1.20.1",
    "recordedOn": "2026-09-04",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.20.1+67",
    "sourceSha": "e9284bd040294d8d2ea5ce34f31367510d691a6a",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-04T02:01:54-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.20.0",
    "app": "yajalal",
    "version": "1.20.0",
    "recordedOn": "2026-09-03",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.20.0+66",
    "sourceSha": "5df46eb83f801b408dbf2d26f7c1974a500b720c",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-03T02:02:12-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.8",
    "app": "choose-window",
    "version": "1.1.8",
    "recordedOn": "2026-09-03",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.1.8+14",
    "sourceSha": "cfa20a2d0e6935354bb650c2c8b8f4c7f50ee304",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-03T07:55:07-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.19.5",
    "app": "yajalal",
    "version": "1.19.5",
    "recordedOn": "2026-09-02",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-02T00:46:34-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.7",
    "app": "choose-window",
    "version": "1.1.7",
    "recordedOn": "2026-09-02",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-09-02T01:16:49-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.1",
    "app": "unairplane",
    "version": "1.0.1",
    "recordedOn": "2026-09-02",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "sourceTag": "app-v1.0.1",
    "sourceSha": "d6698ec4977ddde7dc880d02ed0b2f6b210e7155",
    "notesSource": "github-release",
    "platforms": []
  },
  {
    "id": "yajalal-1.19.4",
    "app": "yajalal",
    "version": "1.19.4",
    "recordedOn": "2026-08-31",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-30T10:31:03-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.6",
    "app": "choose-window",
    "version": "1.1.6",
    "recordedOn": "2026-08-31",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-31T02:16:29-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.5",
    "app": "choose-window",
    "version": "1.1.5",
    "recordedOn": "2026-08-31",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-30T09:55:52-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "unairplane-1.0.2",
    "app": "unairplane",
    "version": "1.0.2",
    "recordedOn": "2026-08-31",
    "notes": "",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-31T00:12:28-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.19.3",
    "app": "yajalal",
    "version": "1.19.3",
    "recordedOn": "2026-08-29",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-28T19:59:24-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.19.2",
    "app": "yajalal",
    "version": "1.19.2",
    "recordedOn": "2026-08-26",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-26T04:57:23-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.19.1",
    "app": "yajalal",
    "version": "1.19.1",
    "recordedOn": "2026-08-25",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-25T06:57:57-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.19.0",
    "app": "yajalal",
    "version": "1.19.0",
    "recordedOn": "2026-08-22",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-22T00:38:15-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.3",
    "app": "choose-window",
    "version": "1.1.3",
    "recordedOn": "2026-08-21",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-20T08:49:38-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.2",
    "app": "choose-window",
    "version": "1.1.2",
    "recordedOn": "2026-08-13",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-13T01:51:19-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.1",
    "app": "choose-window",
    "version": "1.1.1",
    "recordedOn": "2026-08-12",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-11T21:12:44-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.1.0",
    "app": "choose-window",
    "version": "1.1.0",
    "recordedOn": "2026-08-08",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-08-07T10:11:48-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.18.4",
    "app": "yajalal",
    "version": "1.18.4",
    "recordedOn": "2026-07-05",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-07-05T06:46:52-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.18.3",
    "app": "yajalal",
    "version": "1.18.3",
    "recordedOn": "2026-07-02",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-07-02T05:28:01-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.18.2",
    "app": "yajalal",
    "version": "1.18.2",
    "recordedOn": "2026-06-29",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-29T04:37:53-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.18.1",
    "app": "yajalal",
    "version": "1.18.1",
    "recordedOn": "2026-06-27",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.\n",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-26T20:10:08-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.18.0",
    "app": "yajalal",
    "version": "1.18.0",
    "recordedOn": "2026-06-24",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-24T06:09:48-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.5",
    "app": "yajalal",
    "version": "1.17.5",
    "recordedOn": "2026-06-09",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-09T06:18:08-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.4",
    "app": "yajalal",
    "version": "1.17.4",
    "recordedOn": "2026-06-08",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-08T07:41:32-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.3",
    "app": "yajalal",
    "version": "1.17.3",
    "recordedOn": "2026-06-07",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-06T20:44:26-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.2",
    "app": "yajalal",
    "version": "1.17.2",
    "recordedOn": "2026-06-06",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-05T08:15:59-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.1",
    "app": "yajalal",
    "version": "1.17.1",
    "recordedOn": "2026-06-02",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-06-01T17:06:58-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.17.0",
    "app": "yajalal",
    "version": "1.17.0",
    "recordedOn": "2026-05-31",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-31T05:03:52-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.16.0",
    "app": "yajalal",
    "version": "1.16.0",
    "recordedOn": "2026-05-31",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-30T09:32:46-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.15.1",
    "app": "yajalal",
    "version": "1.15.1",
    "recordedOn": "2026-05-29",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-28T08:41:51-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.15.0",
    "app": "yajalal",
    "version": "1.15.0",
    "recordedOn": "2026-05-26",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-26T07:57:25-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.14.1",
    "app": "yajalal",
    "version": "1.14.1",
    "recordedOn": "2026-05-21",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-21T07:57:17-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.14.0",
    "app": "yajalal",
    "version": "1.14.0",
    "recordedOn": "2026-05-19",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-19T06:40:58-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.13.1",
    "app": "yajalal",
    "version": "1.13.1",
    "recordedOn": "2026-05-06",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-06T06:52:14-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.13.0",
    "app": "yajalal",
    "version": "1.13.0",
    "recordedOn": "2026-05-04",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-05-03T08:32:54-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.12.3",
    "app": "yajalal",
    "version": "1.12.3",
    "recordedOn": "2026-04-21",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-04-21T06:16:26-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.12.2",
    "app": "yajalal",
    "version": "1.12.2",
    "recordedOn": "2026-04-21",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-04-20T08:49:06-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.12.1",
    "app": "yajalal",
    "version": "1.12.1",
    "recordedOn": "2026-04-18",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-04-17T21:07:34-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.12.0",
    "app": "yajalal",
    "version": "1.12.0",
    "recordedOn": "2026-04-14",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-04-13T09:23:36-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.11.0",
    "app": "yajalal",
    "version": "1.11.0",
    "recordedOn": "2026-04-12",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-04-11T15:04:02-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.10.0",
    "app": "yajalal",
    "version": "1.10.0",
    "recordedOn": "2026-03-29",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-03-28T18:53:11-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.9.4",
    "app": "yajalal",
    "version": "1.9.4",
    "recordedOn": "2026-03-16",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-03-16T04:55:02-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.9.3",
    "app": "yajalal",
    "version": "1.9.3",
    "recordedOn": "2026-02-23",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-23T05:45:45-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.0.2",
    "app": "choose-window",
    "version": "1.0.2",
    "recordedOn": "2026-02-23",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-23T04:56:50-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.9.2",
    "app": "yajalal",
    "version": "1.9.2",
    "recordedOn": "2026-02-22",
    "notes": "사용자 경험 향상을 위해 앱 성능을 최적화하고 안정성을 개선했습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-22T01:10:36-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.9.1",
    "app": "yajalal",
    "version": "1.9.1",
    "recordedOn": "2026-02-19",
    "notes": "- 즐겨찾기 기능이 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-18T09:01:12-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.0.1",
    "app": "choose-window",
    "version": "1.0.1",
    "recordedOn": "2026-02-17",
    "notes": "숨겨진 버그들이 수정되었어요.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-17T03:38:51-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "choose-window-1.0",
    "app": "choose-window",
    "version": "1.0",
    "recordedOn": "2026-02-12",
    "notes": "",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-12T04:52:06-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.9.0",
    "app": "yajalal",
    "version": "1.9.0",
    "recordedOn": "2026-02-10",
    "notes": "- 퓨처스리그가 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-02-10T06:33:40-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.8.4",
    "app": "yajalal",
    "version": "1.8.4",
    "recordedOn": "2026-01-25",
    "notes": "- 퓨처스리그가 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-01-24T21:28:25-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.8.3",
    "app": "yajalal",
    "version": "1.8.3",
    "recordedOn": "2026-01-24",
    "notes": "- 퓨처스리그가 추가되었습니다",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-01-23T22:09:52-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.8.2",
    "app": "yajalal",
    "version": "1.8.2",
    "recordedOn": "2026-01-11",
    "notes": "- 퓨처스리그가 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-01-11T02:48:50-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.8.1",
    "app": "yajalal",
    "version": "1.8.1",
    "recordedOn": "2026-01-06",
    "notes": "- 퓨처스리그가 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-01-06T06:57:58-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.8.0",
    "app": "yajalal",
    "version": "1.8.0",
    "recordedOn": "2026-01-05",
    "notes": "- 퓨처스리그가 추가되었습니다",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2026-01-05T06:30:19-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.7.0",
    "app": "yajalal",
    "version": "1.7.0",
    "recordedOn": "2025-12-30",
    "notes": "- 스탯 페이지가 생성되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-12-29T07:37:49-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.6.0",
    "app": "yajalal",
    "version": "1.6.0",
    "recordedOn": "2025-12-16",
    "notes": "- AI 분석이 추가되었습니다.\n- 시리즈가 추가되었습니다.\n- 역대 랭킹이 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-12-15T08:14:25-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.5.3",
    "app": "yajalal",
    "version": "1.5.3",
    "recordedOn": "2025-11-24",
    "notes": "- FA 리스트가 업데이트 되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-11-24T05:39:37-08:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.5.2",
    "app": "yajalal",
    "version": "1.5.2",
    "recordedOn": "2025-10-29",
    "notes": "- 소소한 버그가 개선 되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-10-29T07:39:00-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.5.1",
    "app": "yajalal",
    "version": "1.5.1",
    "recordedOn": "2025-09-25",
    "notes": "- 숨어있는 버그가 개선되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-24T08:18:36-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.5.0",
    "app": "yajalal",
    "version": "1.5.0",
    "recordedOn": "2025-09-22",
    "notes": "- FA 탭이 추가되었습니다.\n- 일정 화면에서 팀 순위를 볼 수 있습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-22T06:50:23-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.4.0",
    "app": "yajalal",
    "version": "1.4.0",
    "recordedOn": "2025-09-19",
    "notes": "- 일정 화면에서 스코어 보드가 추가되었습니다.\n- 공유 실패 버그가 수정되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-19T06:02:14-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.3.2",
    "app": "yajalal",
    "version": "1.3.2",
    "recordedOn": "2025-09-16",
    "notes": "- 실시간 경기 정보가 표시됩니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-16T07:02:15-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.3.1",
    "app": "yajalal",
    "version": "1.3.1",
    "recordedOn": "2025-09-16",
    "notes": "- 진행 중인 경기에서 현재 등판한 선수에 대해 실시간으로 알 수 있게 되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-15T15:07:34-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.3.0",
    "app": "yajalal",
    "version": "1.3.0",
    "recordedOn": "2025-09-15",
    "notes": "- 선수에 대한 내년 FA 여부에 대한 정보가 추가되었습니다.\n- 선수에 대한 FA 이력들에 대한 정보가 추가되었습니다.\n- 선수에 대한 수상 이력이 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-14T09:42:57-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.2.1",
    "app": "yajalal",
    "version": "1.2.1",
    "recordedOn": "2025-09-09",
    "notes": "- 숨어있는 소소한 버그가 수정되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-09T07:07:31-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.2.0",
    "app": "yajalal",
    "version": "1.2.0",
    "recordedOn": "2025-09-08",
    "notes": "- 전반기, 후반기 스탯을 볼 수 있는 탭이 추가 되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-08T07:26:02-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.1.0",
    "app": "yajalal",
    "version": "1.1.0",
    "recordedOn": "2025-09-07",
    "notes": "- 경기일정 검색이 추가되었습니다.\n- 선수의 최근 10경기 스탯 보기에 대한 기능이 추가 되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-07T07:15:48-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.6",
    "app": "yajalal",
    "version": "1.0.6",
    "recordedOn": "2025-09-03",
    "notes": "소소한 버그가 수정되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-03T07:44:09-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.5",
    "app": "yajalal",
    "version": "1.0.5",
    "recordedOn": "2025-09-01",
    "notes": "소소한 버그가 수정되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-09-01T07:26:33-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.4",
    "app": "yajalal",
    "version": "1.0.4",
    "recordedOn": "2025-08-15",
    "notes": "- 공유 기능이 추가되었습니다.",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-08-15T05:19:23-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.3",
    "app": "yajalal",
    "version": "1.0.3",
    "recordedOn": "2025-08-12",
    "notes": "- 경기 미리보기 화면 버그 수정\n- 경기 결과 화면 버그 수정",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-08-12T07:54:46-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.2",
    "app": "yajalal",
    "version": "1.0.2",
    "recordedOn": "2025-08-11",
    "notes": "- 랭킹에 병살타,삼진,볼넷 추가\n- 경기 종료 후 집계 전까지 점수판 화면 접근 허용",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-08-11T05:08:18-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0.1",
    "app": "yajalal",
    "version": "1.0.1",
    "recordedOn": "2025-08-09",
    "notes": "경기 결과 화면에서 투수 결과 값들 순서 변경",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-08-09T06:21:49-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  },
  {
    "id": "yajalal-1.0",
    "app": "yajalal",
    "version": "1.0",
    "recordedOn": "2025-08-05",
    "notes": "",
    "platforms": [
      {
        "platform": "ios",
        "status": "available",
        "asOf": "2026-10-22"
      }
    ],
    "notesSource": "app-store",
    "storeMetadataCreatedAt": "2025-08-05T06:53:51-07:00",
    "storeObservedAt": "2026-10-22T01:22:53.115Z"
  }
];
