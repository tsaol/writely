import { Button, Form, Tooltip } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { Settings } from '../types'
import { useSettings } from '../../common/store/settings'
import { OPENAISettings } from './open-api'
import { SystemSetting } from './system'
import { LogosGithubIcon } from '@/components/icon/github'
import { CodiconFeedback } from '@/components/icon/feedback'
import { useForm } from 'antd/es/form/Form'
import i18next from 'i18next'
import { ProviderSetting } from './provider'
import { BedrockSettings } from './bedrock'

export const SettingsForm: React.FC = () => {
  const { loading, settings, setSettings } = useSettings()
  const { mutate } = useSWRConfig()
  const [form] = useForm()

  const handleFormChange = useCallback(
    async (changedValue: Settings) => {
      await setSettings(changedValue)

      if (changedValue.lang) {
        location.reload()
      }
    },
    [setSettings]
  )

  useEffect(() => {
    form.setFieldsValue(settings)
  }, [settings])

  useEffect(() => {
    if (!loading) {
      mutate('models')
    }
  }, [loading])

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between lg:w-5/6 border-b mb-4 pt-6 pb-1"></div>
      <Form
        onValuesChange={handleFormChange}
        initialValues={settings}
        labelCol={{ span: 5 }}
        form={form}
      >
        <div className="max-w-4xl w-[800px] flex flex-col gap-4">
          <ProviderSetting />
          <OPENAISettings />
          <BedrockSettings />
          <SystemSetting />
        </div>
      </Form>
    </div>
  )
}
