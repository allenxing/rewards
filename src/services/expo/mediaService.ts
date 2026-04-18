import { Audio } from 'expo-av'

// 音效类型
export type SoundType = 'coin' | 'deduct' | 'success' | 'badge' | 'switch' | 'click'

class MediaService {
  private sounds: Record<SoundType, Audio.Sound | null> = {
    coin: null,
    deduct: null,
    success: null,
    badge: null,
    switch: null,
    click: null,
  }

  private isEnabled = true

  // 初始化所有音效
  async initialize() {
    try {
      // 加载音效文件（后续需要将音频文件放到assets/audio目录下）
      // 这里先定义结构，后续添加实际音频文件后完善
      console.log('音效服务初始化完成')
    } catch (error) {
      console.error('加载音效失败:', error)
    }
  }

  // 播放音效
  async playSound(type: SoundType) {
    if (!this.isEnabled) return

    try {
      // 后续实现实际播放逻辑
      console.log(`播放音效: ${type}`)
    } catch (error) {
      console.error(`播放音效 ${type} 失败:`, error)
    }
  }

  // 开关音效
  toggleSound(enabled: boolean) {
    this.isEnabled = enabled
  }

  // 释放资源
  async unload() {
    for (const sound of Object.values(this.sounds)) {
      if (sound) {
        await sound.unloadAsync()
      }
    }
  }
}

export const mediaService = new MediaService()
export default mediaService
