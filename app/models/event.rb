# == Schema Information
#
# Table name: events
#
#  id         :integer          not null, primary key
#  title      :string
#  start      :datetime
#  end        :datetime
#  color      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Event < ApplicationRecord
  validates :title, presence: true
  attr_accessor :date_range

  def self.unscheduled()
    select { |record| record.not_scheduled? }
  end

  def all_day_event?
    !not_scheduled? && self.start == self.start.midnight && self.end == self.end.midnight ? true : false
  end

  def not_scheduled?
    self.start.blank? && self.end.blank?
  end
end
