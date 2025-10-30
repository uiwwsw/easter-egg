/// <reference lib="dom" />
const EVENT_PREFIX = {
  Keyboard: "keyboard",
  Pointer: "pointer",
} as const;

type EventPrefix = (typeof EVENT_PREFIX)[keyof typeof EVENT_PREFIX];

export type EasterEggEvent = `${EventPrefix}:${string}`;

type RegisteredListeners = {
  keyboardListener?: (event: KeyboardEvent) => void;
  pointerListeners: Map<string, EventListener>;
};

const listenerRegistry = new WeakMap<HTMLElement, Map<string, RegisteredListeners>>();

function normalizeEventDescriptor(eventDescriptor: string): EasterEggEvent {
  const [rawPrefix, ...rawValueParts] = eventDescriptor.split(":");
  const prefix = rawPrefix?.trim().toLowerCase();
  const value = rawValueParts.join(":").trim();

  if (!prefix || !value) {
    throw new Error(`Invalid event descriptor: "${eventDescriptor}"`);
  }

  if (prefix !== EVENT_PREFIX.Keyboard && prefix !== EVENT_PREFIX.Pointer) {
    throw new Error(`Unsupported event type: "${prefix}". Use "keyboard" or "pointer".`);
  }

  if (prefix === EVENT_PREFIX.Pointer) {
    return `${prefix}:${value.toLowerCase()}` as EasterEggEvent;
  }

  return `${prefix}:${value}` as EasterEggEvent;
}

/**
 * 지정된 이벤트 시퀀스가 순서대로 발생하면 콜백 함수를 실행하는 이스터에그를 설정합니다.
 * 이 버전은 디버거 탐지 및 코드 난독화 기능이 포함되어 있습니다.
 * @param targetElement 이벤트를 수신할 HTML 요소 (예: document.body)
 * @param callback 시퀀스가 일치했을 때 실행될 함수
 * @param eventSequence 감지할 이벤트 설명 문자열 배열 (e.g., ['keyboard:ArrowUp', 'pointer:click'])
 */
export function createEasterEgg(
  targetElement: HTMLElement,
  callback: () => void,
  eventSequence: EasterEggEvent[]
): void {
  let currentSequence: EasterEggEvent[] = [];

  const normalizedSequence = eventSequence.map(normalizeEventDescriptor);

  if (normalizedSequence.length === 0) {
    throw new Error("eventSequence must contain at least one event descriptor.");
  }

  // 1. 이벤트 시퀀스를 Base64로 인코딩하여 유추하기 어렵게 만듭니다.
  const obfuscatedSequence = btoa(JSON.stringify(normalizedSequence));
  const sequenceKey = obfuscatedSequence;

  const existingRegistry = listenerRegistry.get(targetElement);
  const listenerMap = existingRegistry ?? new Map<string, RegisteredListeners>();

  if (!existingRegistry) {
    listenerRegistry.set(targetElement, listenerMap);
  }

  const previousListeners = listenerMap.get(sequenceKey);
  if (previousListeners) {
    if (previousListeners.keyboardListener) {
      targetElement.removeEventListener("keydown", previousListeners.keyboardListener);
    }
    previousListeners.pointerListeners.forEach((listener, eventType) => {
      targetElement.removeEventListener(eventType, listener);
    });
  }

  const decodedSequence = JSON.parse(atob(obfuscatedSequence)) as EasterEggEvent[];

  const handleEvent = (descriptor: EasterEggEvent) => {
    const requiredDescriptor = decodedSequence[currentSequence.length];

    if (descriptor === requiredDescriptor) {
      currentSequence.push(descriptor);

      if (currentSequence.length === decodedSequence.length) {
        setTimeout(() => {
          callback();
        }, 0);
        currentSequence = [];
      }
    } else {
      const firstDescriptor = decodedSequence[0];
      if (descriptor === firstDescriptor) {
        currentSequence = [descriptor];
      } else {
        currentSequence = [];
      }
    }
  };

  const registeredListeners: RegisteredListeners = {
    pointerListeners: new Map<string, EventListener>(),
  };

  if (normalizedSequence.some((descriptor) => descriptor.startsWith(`${EVENT_PREFIX.Keyboard}:`))) {
    const keyboardListener: (event: KeyboardEvent) => void = (event) => {
      warnDebuggerIfDetected();
      handleEvent(`${EVENT_PREFIX.Keyboard}:${event.key}` as EasterEggEvent);
    };
    targetElement.addEventListener("keydown", keyboardListener);
    registeredListeners.keyboardListener = keyboardListener;
  }

  const pointerEventTypes = new Set(
    normalizedSequence
      .filter((descriptor) => descriptor.startsWith(`${EVENT_PREFIX.Pointer}:`))
      .map((descriptor) => descriptor.slice(`${EVENT_PREFIX.Pointer}:`.length))
  );

  pointerEventTypes.forEach((eventType) => {
    const pointerListener: EventListener = (event) => {
      warnDebuggerIfDetected();
      handleEvent(`${EVENT_PREFIX.Pointer}:${event.type.toLowerCase()}` as EasterEggEvent);
    };
    targetElement.addEventListener(eventType, pointerListener);
    registeredListeners.pointerListeners.set(eventType, pointerListener);
  });

  listenerMap.set(sequenceKey, registeredListeners);
}
const warnDebuggerIfDetected = (() => {
  let hasWarned = false;

  return () => {
    if (hasWarned) {
      return false;
    }

    if (typeof window === "undefined") {
      return false;
    }

    const threshold = 160;
    const widthDiff = Math.abs(window.outerWidth - window.innerWidth);
    const heightDiff = Math.abs(window.outerHeight - window.innerHeight);
    const detected = widthDiff > threshold || heightDiff > threshold;

    if (detected) {
      hasWarned = true;
      console.warn("🛑 Debugger Detected! Easter egg functionality will continue but debugger may impact timing.");
      return true;
    }

    return false;
  };
})();
