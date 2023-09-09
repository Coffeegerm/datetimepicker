import {ANDROID_DISPLAY, ANDROID_MODE} from './constants';
import pickers from './picker.android';
import type {AndroidNativeProps, DateTimePickerResult} from './types';
import {sharedPropsValidation} from './utils';
import invariant from 'invariant';
import {processColor} from 'react-native';

type Timestamp = number;

type ProcessedButton = {
  label?: string;
  textColor: ReturnType<typeof processColor>;
};

type OpenParams = {
  value: Timestamp;
  display: AndroidNativeProps['display'];
  is24Hour: AndroidNativeProps['is24Hour'];
  minimumDate: AndroidNativeProps['minimumDate'];
  maximumDate: AndroidNativeProps['maximumDate'];
  minuteInterval: AndroidNativeProps['minuteInterval'];
  timeZoneOffsetInMinutes: AndroidNativeProps['timeZoneOffsetInMinutes'];
  timeZoneName: AndroidNativeProps['timeZoneName'];
  testID: AndroidNativeProps['testID'];
  dialogButtons: {
    positive: ProcessedButton;
    negative: ProcessedButton;
    neutral: ProcessedButton;
  };
};

export type PresentPickerCallback = (
  params: OpenParams,
) => Promise<DateTimePickerResult>;

function getOpenPicker(
  mode: AndroidNativeProps['mode'],
): PresentPickerCallback {
  switch (mode) {
    case ANDROID_MODE.time:
      return ({
        value,
        display,
        is24Hour,
        minuteInterval,
        timeZoneOffsetInMinutes,
        timeZoneName,
        dialogButtons,
      }: OpenParams) =>
        pickers[mode].open({
          value: new Date(value),
          display,
          minuteInterval,
          is24Hour,
          timeZoneOffsetInMinutes,
          timeZoneName,
          dialogButtons,
        });
    default:
      return ({
        value,
        display,
        minimumDate,
        maximumDate,
        timeZoneOffsetInMinutes,
        timeZoneName,
        dialogButtons,
        testID,
      }: OpenParams) =>
        pickers[ANDROID_MODE.date].open({
          value: new Date(value),
          display,
          minimumDate,
          maximumDate,
          timeZoneOffsetInMinutes,
          timeZoneName,
          dialogButtons,
          testID,
        });
  }
}

function validateAndroidProps(props: AndroidNativeProps) {
  sharedPropsValidation({value: props?.value});
  const {mode, display} = props;
  invariant(
    !(display === ANDROID_DISPLAY.calendar && mode === ANDROID_MODE.time) &&
      !(display === ANDROID_DISPLAY.clock && mode === ANDROID_MODE.date),
    `display: ${display} and mode: ${mode} cannot be used together.`,
  );
  if (
    props?.positiveButtonLabel !== undefined ||
    props?.negativeButtonLabel !== undefined ||
    props?.neutralButtonLabel !== undefined
  ) {
    console.warn(
      'positiveButtonLabel, negativeButtonLabel and neutralButtonLabel are deprecated.' +
        'Use positive / negative / neutralButton prop instead.',
    );
  }
}
export {getOpenPicker, validateAndroidProps};
