import React from 'react'
import { Form, Input, Select } from 'antd'
import { useSettings } from '../../common/store/settings'
import { ServiceProvider } from '../types'
import i18next from 'i18next'

export const BedrockSettings: React.FC = () => {
  const { settings, setSettings } = useSettings()

  if (settings.serviceProvider !== ServiceProvider.Bedrock) {
    return null
  }

  const handleSettingChange = (changedValues: any, allValues: any) => {
    setSettings({ ...settings, ...changedValues })
  }

  const regions = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  ]

  const models = [
    {
      value: 'anthropic.claude-3-haiku-20240307-v1:0',
      label: 'Claude 3 Haiku',
    },
    {
      value: 'anthropic.claude-3-sonnet-20240229-v1:0',
      label: 'Claude 3 Sonnet',
    },
    { value: 'anthropic.claude-3-opus-20240229-v1:0', label: 'Claude 3 Opus' },
    { value: 'anthropic.claude-v2:1', label: 'Claude v2' },
    { value: 'anthropic.claude-v1', label: 'Claude v1' },
  ]

  return (
    <div className="flex flex-col py-4 border-border border-t text-xl gap-3 items-center justify-center">
      <Form
        layout="vertical"
        initialValues={settings}
        onValuesChange={handleSettingChange}
      >
        <Form.Item
          name="bedrockAccessKey"
          label={i18next.t('Bedrock Access Key')}
          rules={[
            {
              required: true,
              message: i18next.t('Please input your Bedrock Access Key!'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="bedrockSecretKey"
          label={i18next.t('Bedrock Secret Key')}
          rules={[
            {
              required: true,
              message: i18next.t('Please input your Bedrock Secret Key!'),
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="bedrockRegion"
          label={i18next.t('Bedrock Region')}
          rules={[
            {
              required: true,
              message: i18next.t('Please select your Bedrock Region!'),
            },
          ]}
        >
          <Select>
            {regions.map((region) => (
              <Select.Option key={region.value} value={region.value}>
                {region.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="bedrockModel"
          label={i18next.t('Bedrock Model')}
          rules={[
            {
              required: true,
              message: i18next.t('Please select a Bedrock Model!'),
            },
          ]}
        >
          <Select>
            {models.map((model) => (
              <Select.Option key={model.value} value={model.value}>
                {model.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
}
