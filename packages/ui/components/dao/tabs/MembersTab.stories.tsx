import { ComponentMeta, ComponentStory } from '@storybook/react'

import { useDaoInfoContext } from '@dao-dao/common'
import { DaoPageWrapperDecorator } from '@dao-dao/storybook/decorators'

import { makeProps as makeDaoMemberCardProps } from '../DaoMemberCard.stories'
import { MembersTab } from './MembersTab'

export default {
  title: 'DAO DAO / packages / ui / components / dao / tabs / MembersTab',
  component: MembersTab,
  decorators: [DaoPageWrapperDecorator],
} as ComponentMeta<typeof MembersTab>

const Template: ComponentStory<typeof MembersTab> = (args) => (
  <MembersTab {...args} daoInfo={useDaoInfoContext()} />
)

export const Default = Template.bind({})
Default.args = {
  members: [
    makeDaoMemberCardProps(),
    makeDaoMemberCardProps(),
    makeDaoMemberCardProps(),
    makeDaoMemberCardProps(),
    makeDaoMemberCardProps(),
  ],
  isMember: true,
  showAddMember: true,
}