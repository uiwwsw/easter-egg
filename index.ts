/// <reference lib="dom" />
/**
 * 지정된 키 시퀀스가 순서대로 입력되면 콜백 함수를 실행하는 이스터에그를 설정합니다.
 * 이 버전은 디버거 탐지 및 코드 난독화 기능이 포함되어 있습니다.
 * @param targetElement 이벤트를 수신할 HTML 요소 (예: document.body)
 * @param callback 키 시퀀스가 일치했을 때 실행될 함수
 * @param keySequence 감지할 키 이름의 배열 (e.g., ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown'])
 */
export function createEasterEgg(
  targetElement: HTMLElement,
  callback: () => void,
  keySequence: string[]
): void {
  let currentSequence: string[] = [];

  // 1. 키 시퀀스를 Base64로 인코딩하여 유추하기 어렵게 만듭니다.
  const obfuscatedSequence = btoa(JSON.stringify(keySequence));

  // 2. 디버거 탐지 함수
  const checkDebugger = () => {
    const threshold = 170; // 개발자 도구 창 크기 임계값
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      // 디버거가 열려있으면 시퀀스를 초기화하고 동작을 멈춥니다.
      currentSequence = [];
      return true;
    }
    return false;
  };

  // 오해를 유도하는 콘솔 메시지
  (function () {
    try {
      const re = /./;
      re.toString = function () {
        console.log(
          "%cHehe, you found me! But can you figure out the secret code?",
          "color: #9A2EFE; font-size: 14px; font-weight: bold;"
        );
        return " ";
      };
      console.log("%c ", re);
    } catch (e) {}
  })();
  targetElement.addEventListener("keydown", (event: KeyboardEvent) => {
    // 매 키 입력마다 디버거를 확인합니다.

    if (checkDebugger()) {
      return;
    }

    const decodedSequence: string[] = JSON.parse(atob(obfuscatedSequence));
    const requiredKey = decodedSequence[currentSequence.length];

    if (event.key === requiredKey) {
      currentSequence.push(event.key);

      if (currentSequence.length === decodedSequence.length) {
        // 3. 콜백을 비동기적으로 실행하여 직접적인 호출 스택 추적을 어렵게 합니다.
        setTimeout(() => {
          callback();
        }, 0);
        currentSequence = [];
      }
    } else {
      // 순서가 틀리면 처음부터 다시 시작
      // 사용자가 실수로 다른 키를 눌렀을 때를 대비해, 현재 입력이 시퀀스의 첫 키와 같다면 유지합니다.
      if (event.key === decodedSequence[0]) {
        currentSequence = [event.key];
      } else {
        currentSequence = [];
      }
    }
  });
}
