import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import { db } from '../db'

export const backupService = {
  exportBackup: async (): Promise<string | null> => {
    try {
      const dbPath = FileSystem.documentDirectory + 'family_rewards.db'
      
      // 检查数据库文件是否存在
      const dbInfo = await FileSystem.getInfoAsync(dbPath)
      if (!dbInfo.exists) {
        console.error('数据库文件不存在')
        return null
      }
      
      // 创建备份文件名
      const backupName = `family_rewards_backup_${Date.now()}.db`
      const backupDir = FileSystem.cacheDirectory + 'backups/'
      
      // 确保备份目录存在
      const dirInfo = await FileSystem.getInfoAsync(backupDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true })
      }
      
      const backupPath = backupDir + backupName
      
      // 复制数据库文件
      await FileSystem.copyAsync({ from: dbPath, to: backupPath })
      
      // 检查是否支持分享
      const isAvailable = await Sharing.isAvailableAsync()
      if (isAvailable) {
        await Sharing.shareAsync(backupPath, {
          mimeType: 'application/x-sqlite3',
          dialogTitle: '导出备份',
        })
        return backupPath
      }
      
      return backupPath
    } catch (error) {
      console.error('导出备份失败:', error)
      return null
    }
  },

  importBackup: async (): Promise<boolean> => {
    try {
      // 选择备份文件
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/x-sqlite3',
        copyToCacheDirectory: true,
      })
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return false
      }
      
      const fileUri = result.assets[0].uri
      const dbPath = FileSystem.documentDirectory + 'family_rewards.db'
      
      // 先备份当前数据库
      const preBackupName = `pre_restore_${Date.now()}.db`
      const preBackupDir = FileSystem.cacheDirectory + 'backups/'
      const preBackupPath = preBackupDir + preBackupName
      
      // 确保目录存在
      const dirInfo = await FileSystem.getInfoAsync(preBackupDir)
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(preBackupDir, { intermediates: true })
      }
      
      // 如果当前数据库存在，先备份
      const currentDbInfo = await FileSystem.getInfoAsync(dbPath)
      if (currentDbInfo.exists) {
        await FileSystem.copyAsync({ from: dbPath, to: preBackupPath })
      }
      
      // 复制新数据库覆盖当前数据库
      await FileSystem.copyAsync({ from: fileUri, to: dbPath })
      
      return true
    } catch (error) {
      console.error('导入备份失败:', error)
      return false
    }
  },

  getCacheSize: async (): Promise<number> => {
    try {
      const cacheDir = FileSystem.cacheDirectory
      if (!cacheDir) return 0
      
      const files = await FileSystem.readDirectoryAsync(cacheDir)
      let totalSize = 0
      
      for (const file of files) {
        const info = await FileSystem.getInfoAsync(cacheDir + file)
        if (info.exists && info.size) {
          totalSize += info.size
        }
      }
      
      return totalSize
    } catch (error) {
      return 0
    }
  },

  clearCache: async (): Promise<boolean> => {
    try {
      const cacheDir = FileSystem.cacheDirectory
      if (!cacheDir) return false
      
      await FileSystem.deleteAsync(cacheDir, { idempotent: true })
      return true
    } catch (error) {
      console.error('清理缓存失败:', error)
      return false
    }
  },
}

export default backupService
