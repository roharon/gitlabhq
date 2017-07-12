require 'spec_helper'

describe Geo::BaseSyncService, services: true do
  let(:project) { double('project')}
  subject { described_class.new(project) }

  describe '#primary_ssh_path_prefix' do
    let!(:primary_node) { create(:geo_node, :primary, host: 'primary-geo-node') }

    it 'raises exception when clone_url_prefix is nil' do
      allow_any_instance_of(GeoNode).to receive(:clone_url_prefix) { nil }

      expect { subject.send(:primary_ssh_path_prefix) }.to raise_error Geo::EmptyCloneUrlPrefixError
    end

    it 'returns the prefix defined in the primary node' do
      expect { subject.send(:primary_ssh_path_prefix) }.not_to raise_error
      expect(subject.send(:primary_ssh_path_prefix)).to eq('git@localhost:')
    end
  end
end
