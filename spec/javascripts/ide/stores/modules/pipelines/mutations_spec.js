import mutations from '~/ide/stores/modules/pipelines/mutations';
import state from '~/ide/stores/modules/pipelines/state';
import * as types from '~/ide/stores/modules/pipelines/mutation_types';
import { fullPipelinesResponse, stages, jobs } from '../../../mock_data';

describe('IDE pipelines mutations', () => {
  let mockedState;

  beforeEach(() => {
    mockedState = state();
  });

  describe(types.REQUEST_LATEST_PIPELINE, () => {
    it('sets loading to true', () => {
      mutations[types.REQUEST_LATEST_PIPELINE](mockedState);

      expect(mockedState.isLoadingPipeline).toBe(true);
    });
  });

  describe(types.RECEIVE_LASTEST_PIPELINE_ERROR, () => {
    it('sets loading to false', () => {
      mutations[types.RECEIVE_LASTEST_PIPELINE_ERROR](mockedState);

      expect(mockedState.isLoadingPipeline).toBe(false);
    });
  });

  describe(types.RECEIVE_LASTEST_PIPELINE_SUCCESS, () => {
    it('sets loading to false on success', () => {
      mutations[types.RECEIVE_LASTEST_PIPELINE_SUCCESS](
        mockedState,
        fullPipelinesResponse.data.pipelines[0],
      );

      expect(mockedState.isLoadingPipeline).toBe(false);
    });

    it('sets latestPipeline', () => {
      mutations[types.RECEIVE_LASTEST_PIPELINE_SUCCESS](
        mockedState,
        fullPipelinesResponse.data.pipelines[0],
      );

      expect(mockedState.latestPipeline).toEqual({
        id: '51',
        path: 'test',
        commit: { id: '123' },
        details: { status: jasmine.any(Object) },
        yamlError: undefined,
      });
    });

    it('does not set latest pipeline if pipeline is null', () => {
      mutations[types.RECEIVE_LASTEST_PIPELINE_SUCCESS](mockedState, null);

      expect(mockedState.latestPipeline).toEqual(false);
    });

    it('sets stages', () => {
      mutations[types.RECEIVE_LASTEST_PIPELINE_SUCCESS](
        mockedState,
        fullPipelinesResponse.data.pipelines[0],
      );

      expect(mockedState.stages.length).toBe(2);
      expect(mockedState.stages).toEqual([
        {
          id: 0,
          dropdownPath: stages[0].dropdown_path,
          name: stages[0].name,
          status: stages[0].status,
          isCollapsed: false,
          isLoading: false,
          jobs: [],
        },
        {
          id: 1,
          dropdownPath: stages[1].dropdown_path,
          name: stages[1].name,
          status: stages[1].status,
          isCollapsed: false,
          isLoading: false,
          jobs: [],
        },
      ]);
    });
  });

  describe(types.REQUEST_JOBS, () => {
    beforeEach(() => {
      mockedState.stages = stages.map((stage, i) => ({
        ...stage,
        id: i,
      }));
    });

    it('sets isLoading on stage', () => {
      mutations[types.REQUEST_JOBS](mockedState, mockedState.stages[0].id);

      expect(mockedState.stages[0].isLoading).toBe(true);
    });
  });

  describe(types.RECEIVE_JOBS_ERROR, () => {
    beforeEach(() => {
      mockedState.stages = stages.map((stage, i) => ({
        ...stage,
        id: i,
      }));
    });

    it('sets isLoading on stage after error', () => {
      mutations[types.RECEIVE_JOBS_ERROR](mockedState, mockedState.stages[0].id);

      expect(mockedState.stages[0].isLoading).toBe(false);
    });
  });

  describe(types.RECEIVE_JOBS_SUCCESS, () => {
    let data;

    beforeEach(() => {
      mockedState.stages = stages.map((stage, i) => ({
        ...stage,
        id: i,
      }));

      data = {
        latest_statuses: [...jobs],
      };
    });

    it('updates loading', () => {
      mutations[types.RECEIVE_JOBS_SUCCESS](mockedState, { id: mockedState.stages[0].id, data });

      expect(mockedState.stages[0].isLoading).toBe(false);
    });

    it('sets jobs on stage', () => {
      mutations[types.RECEIVE_JOBS_SUCCESS](mockedState, { id: mockedState.stages[0].id, data });

      expect(mockedState.stages[0].jobs.length).toBe(jobs.length);
      expect(mockedState.stages[0].jobs).toEqual(
        jobs.map(job => ({
          id: job.id,
          name: job.name,
          status: job.status,
          path: job.build_path,
        })),
      );
    });
  });

  describe(types.TOGGLE_STAGE_COLLAPSE, () => {
    beforeEach(() => {
      mockedState.stages = stages.map((stage, i) => ({
        ...stage,
        id: i,
        isCollapsed: false,
      }));
    });

    it('toggles collapsed state', () => {
      const stage = mockedState.stages[0];

      mutations[types.TOGGLE_STAGE_COLLAPSE](mockedState, stage.id);

      expect(stage.isCollapsed).toBe(true);

      mutations[types.TOGGLE_STAGE_COLLAPSE](mockedState, stage.id);

      expect(stage.isCollapsed).toBe(false);
    });
  });
});
