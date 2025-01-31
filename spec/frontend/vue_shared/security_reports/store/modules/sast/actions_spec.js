import MockAdapter from 'axios-mock-adapter';
import testAction from 'helpers/vuex_action_helper';

import axios from '~/lib/utils/axios_utils';
import { HTTP_STATUS_NOT_FOUND } from '~/lib/utils/http_status';
import * as actions from '~/vue_shared/security_reports/store/modules/sast/actions';
import * as types from '~/vue_shared/security_reports/store/modules/sast/mutation_types';
import createState from '~/vue_shared/security_reports/store/modules/sast/state';

const diffEndpoint = 'diff-endpoint.json';
const blobPath = 'blob-path.json';
const reports = {
  base: 'base',
  head: 'head',
  enrichData: 'enrichData',
  diff: 'diff',
};
const error = 'Something went wrong';
const vulnerabilityFeedbackPath = 'vulnerability-feedback-path';
const rootState = { vulnerabilityFeedbackPath, blobPath };

let state;

describe('sast report actions', () => {
  beforeEach(() => {
    state = createState();
  });

  describe('setDiffEndpoint', () => {
    it(`should commit ${types.SET_DIFF_ENDPOINT} with the correct path`, () => {
      return testAction(
        actions.setDiffEndpoint,
        diffEndpoint,
        state,
        [
          {
            type: types.SET_DIFF_ENDPOINT,
            payload: diffEndpoint,
          },
        ],
        [],
      );
    });
  });

  describe('requestDiff', () => {
    it(`should commit ${types.REQUEST_DIFF}`, () => {
      return testAction(actions.requestDiff, {}, state, [{ type: types.REQUEST_DIFF }], []);
    });
  });

  describe('receiveDiffSuccess', () => {
    it(`should commit ${types.RECEIVE_DIFF_SUCCESS} with the correct response`, () => {
      return testAction(
        actions.receiveDiffSuccess,
        reports,
        state,
        [
          {
            type: types.RECEIVE_DIFF_SUCCESS,
            payload: reports,
          },
        ],
        [],
      );
    });
  });

  describe('receiveDiffError', () => {
    it(`should commit ${types.RECEIVE_DIFF_ERROR} with the correct response`, () => {
      return testAction(
        actions.receiveDiffError,
        error,
        state,
        [
          {
            type: types.RECEIVE_DIFF_ERROR,
            payload: error,
          },
        ],
        [],
      );
    });
  });

  describe('fetchDiff', () => {
    let mock;

    beforeEach(() => {
      mock = new MockAdapter(axios);
      state.paths.diffEndpoint = diffEndpoint;
      rootState.canReadVulnerabilityFeedback = true;
    });

    afterEach(() => {
      mock.restore();
    });

    describe('when diff and vulnerability feedback endpoints respond successfully', () => {
      beforeEach(() => {
        mock
          .onGet(diffEndpoint)
          .replyOnce(200, reports.diff)
          .onGet(vulnerabilityFeedbackPath)
          .replyOnce(200, reports.enrichData);
      });

      it('should dispatch the `receiveDiffSuccess` action', () => {
        const { diff, enrichData } = reports;
        return testAction(
          actions.fetchDiff,
          {},
          { ...rootState, ...state },
          [],
          [
            { type: 'requestDiff' },
            {
              type: 'receiveDiffSuccess',
              payload: {
                diff,
                enrichData,
              },
            },
          ],
        );
      });
    });

    describe('when diff endpoint responds successfully and fetching vulnerability feedback is not authorized', () => {
      beforeEach(() => {
        rootState.canReadVulnerabilityFeedback = false;
        mock.onGet(diffEndpoint).replyOnce(200, reports.diff);
      });

      it('should dispatch the `receiveDiffSuccess` action with empty enrich data', () => {
        const { diff } = reports;
        const enrichData = [];
        return testAction(
          actions.fetchDiff,
          {},
          { ...rootState, ...state },
          [],
          [
            { type: 'requestDiff' },
            {
              type: 'receiveDiffSuccess',
              payload: {
                diff,
                enrichData,
              },
            },
          ],
        );
      });
    });

    describe('when the vulnerability feedback endpoint fails', () => {
      beforeEach(() => {
        mock
          .onGet(diffEndpoint)
          .replyOnce(200, reports.diff)
          .onGet(vulnerabilityFeedbackPath)
          .replyOnce(HTTP_STATUS_NOT_FOUND);
      });

      it('should dispatch the `receiveError` action', () => {
        return testAction(
          actions.fetchDiff,
          {},
          { ...rootState, ...state },
          [],
          [{ type: 'requestDiff' }, { type: 'receiveDiffError' }],
        );
      });
    });

    describe('when the diff endpoint fails', () => {
      beforeEach(() => {
        mock
          .onGet(diffEndpoint)
          .replyOnce(HTTP_STATUS_NOT_FOUND)
          .onGet(vulnerabilityFeedbackPath)
          .replyOnce(200, reports.enrichData);
      });

      it('should dispatch the `receiveDiffError` action', () => {
        return testAction(
          actions.fetchDiff,
          {},
          { ...rootState, ...state },
          [],
          [{ type: 'requestDiff' }, { type: 'receiveDiffError' }],
        );
      });
    });
  });
});
