/*
 * <<
 * wormhole
 * ==
 * Copyright (C) 2016 - 2017 EDP
 * ==
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * >>
 */

import { takeLatest, takeEvery } from 'redux-saga'
import { call, fork, put } from 'redux-saga/effects'
import {
  LOAD_USER_STREAMS,
  LOAD_ADMIN_ALL_STREAMS,
  LOAD_ADMIN_SINGLE_STREAM,
  LOAD_OFFSET,
  LOAD_STREAM_NAME_VALUE,
  LOAD_KAFKA,
  LOAD_STREAM_CONFIG_JVM,
  LOAD_TOPICS,
  EDIT_TOPICS,
  LOAD_LOGS_INFO,
  LOAD_ADMIN_LOGS_INFO,
  ADD_STREAMS,
  LOAD_SINGLE_STREAM,
  EDIT_STREAM,
  OPERATE_STREAMS,
  STARTORRENEW_STREAMS
} from './constants'

import {
  userStreamsLoaded,
  adminAllStreamsLoaded,
  adminSingleStreamLoaded,
  offsetLoaded,
  streamNameValueLoaded,
  kafkaLoaded,
  streamConfigJvmLoaded,
  topicsLoaded,
  topicsEdited,
  logsInfoLoaded,
  adminLogsInfoLoaded,
  streamAdded,
  singleStreamLoaded,
  streamEdited,
  streamOperated,
  streamStartOrRenewed,
  streamOperatedError
} from './action'

import request from '../../utils/request'
import api from '../../utils/api'
import { notifySagasError } from '../../utils/util'

export function* getUserStreams ({ payload }) {
  try {
    const streams = yield call(request, `${api.projectStream}/${payload.projectId}/streams`)
    yield put(userStreamsLoaded(streams.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getUserStreams')
  }
}

export function* getUserStreamsWatcher () {
  yield fork(takeLatest, LOAD_USER_STREAMS, getUserStreams)
}

export function* getAdminAllStreams ({ payload }) {
  try {
    const streams = yield call(request, api.stream)
    yield put(adminAllStreamsLoaded(streams.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getAdminAllStreams')
  }
}

export function* getAdminAllFlowsWatcher () {
  yield fork(takeLatest, LOAD_ADMIN_ALL_STREAMS, getAdminAllStreams)
}

export function* getAdminSingleStream ({ payload }) {
  try {
    const streams = yield call(request, `${api.projectAdminStream}/${payload.projectId}/streams`)
    yield put(adminSingleStreamLoaded(streams.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getAdminSingleStream')
  }
}

export function* getAdminSingleFlowWatcher () {
  yield fork(takeLatest, LOAD_ADMIN_SINGLE_STREAM, getAdminSingleStream)
}

export function* getOffset ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.streamId}/intopics`
    })
    yield put(offsetLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getOffset')
  }
}

export function* getOffsetWatcher () {
  yield fork(takeLatest, LOAD_OFFSET, getOffset)
}

export function* getStreamNameValue ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/streams?streamName=${payload.value}`
    })
    if (result.code === 409) {
      yield put(streamNameValueLoaded(result.msg, payload.reject))
    } else {
      yield put(streamNameValueLoaded(result.payload, payload.resolve))
    }
  } catch (err) {
    notifySagasError(err, 'getStreamNameValue')
  }
}

export function* getStreamNameValueWatcher () {
  yield fork(takeLatest, LOAD_STREAM_NAME_VALUE, getStreamNameValue)
}

export function* getKafka ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/instances/kafka`
    })
    yield put(kafkaLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getKafka')
  }
}

export function* getKafkaWatcher () {
  yield fork(takeLatest, LOAD_KAFKA, getKafka)
}

export function* getStreamConfigJvm ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/streams/default/config`
    })
    yield put(streamConfigJvmLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getStreamConfigJvm')
  }
}

export function* getStreamConfigJvmWatcher () {
  yield fork(takeLatest, LOAD_STREAM_CONFIG_JVM, getStreamConfigJvm)
}

export function* getTopics ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/instances/${payload.instanceId}/databases`
    })
    yield put(topicsLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getTopics')
  }
}

export function* getTopicsWatcher () {
  yield fork(takeLatest, LOAD_TOPICS, getTopics)
}

export function* editTopics ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'put',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.streamId}/intopics`,
      data: payload.values
    })
    yield put(topicsEdited(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'editTopics')
  }
}

export function* editTopicsWathcer () {
  yield fork(takeEvery, EDIT_TOPICS, editTopics)
}

export function* getLogs ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.streamId}/logs`
    })
    yield put(logsInfoLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getLogs')
  }
}

export function* getLogsWatcher () {
  yield fork(takeLatest, LOAD_LOGS_INFO, getLogs)
}

export function* getAdminLogs ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectList}/${payload.projectId}/streams/${payload.streamId}/logs`
    })
    yield put(adminLogsInfoLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getAdminLogs')
  }
}

export function* getAdminLogsWatcher () {
  yield fork(takeLatest, LOAD_ADMIN_LOGS_INFO, getAdminLogs)
}

export function* addStream ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'post',
      url: `${api.projectUserList}/${payload.stream.projectId}/streams`,
      data: payload.stream
    })
    if (result.code && result.code !== 200) {
      yield put(streamOperatedError(result.msg, payload.reject))
    } else if (result.header.code && result.header.code === 200) {
      yield put(streamAdded(result.payload, payload.resolve))
    }
  } catch (err) {
    notifySagasError(err, 'addStream')
  }
}

export function* addStreamWathcer () {
  yield fork(takeEvery, ADD_STREAMS, addStream)
}

export function* getSingleStream ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.streamId}`
    })
    yield put(singleStreamLoaded(result.payload, payload.resolve))
  } catch (err) {
    notifySagasError(err, 'getSingleStream')
  }
}

export function* getSingleStreamWatcher () {
  yield fork(takeLatest, LOAD_SINGLE_STREAM, getSingleStream)
}

export function* editStream ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'put',
      url: `${api.projectStream}/${payload.stream.projectId}/streams`,
      data: payload.stream
    })
    if (result.code && result.code !== 200) {
      yield put(streamOperatedError(result.msg, payload.reject))
    } else if (result.header.code && result.header.code === 200) {
      yield put(streamEdited(result.payload, payload.resolve))
    }
  } catch (err) {
    notifySagasError(err, 'editStream')
  }
}

export function* editStreamWathcer () {
  yield fork(takeEvery, EDIT_STREAM, editStream)
}

export function* operateStream ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'get',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.id}/${payload.action}`
    })
    if (result.code && result.code !== 200) {
      yield put(streamOperatedError(result.msg, payload.reject))
    } else if (result.header.code && result.header.code === 200) {
      yield put(streamOperated(result.payload[0], payload.resolve))
    }
  } catch (err) {
    notifySagasError(err, 'operateStream')
  }
}

export function* operateStreamWathcer () {
  yield fork(takeEvery, OPERATE_STREAMS, operateStream)
}

export function* startOrRenewStream ({ payload }) {
  try {
    const result = yield call(request, {
      method: 'put',
      url: `${api.projectStream}/${payload.projectId}/streams/${payload.id}/${payload.action}`,
      data: payload.topicResult
    })
    if (result.code && result.code !== 200) {
      yield put(streamOperatedError(result.msg, payload.reject))
    } else if (result.header.code && result.header.code === 200) {
      yield put(streamStartOrRenewed(result.payload, payload.resolve))
    }
  } catch (err) {
    notifySagasError(err, 'startOrRenewStream')
  }
}

export function* startOrRenewStreamWathcer () {
  yield fork(takeEvery, STARTORRENEW_STREAMS, startOrRenewStream)
}

export default [
  getUserStreamsWatcher,
  getAdminAllFlowsWatcher,
  getAdminSingleFlowWatcher,
  getOffsetWatcher,
  getStreamNameValueWatcher,
  getKafkaWatcher,
  getStreamConfigJvmWatcher,
  getTopicsWatcher,
  editTopicsWathcer,
  getLogsWatcher,
  getAdminLogsWatcher,
  addStreamWathcer,
  getSingleStreamWatcher,
  editStreamWathcer,
  operateStreamWathcer,
  startOrRenewStreamWathcer
]