package com.convrtx.memee.videoeditor.impl
import com.convrtx.memee.R
import com.banuba.sdk.cameraui.data.CameraTimerStateProvider
import com.banuba.sdk.cameraui.data.TimerEntry

internal class IntegrationTimerStateProvider : CameraTimerStateProvider {

    override val timerStates = listOf(
            TimerEntry(
                    durationMs = 0,
                    iconResId = R.drawable.ic_stopwatch_off
            ),
            TimerEntry(
                    durationMs = 3000,
                    iconResId = R.drawable.ic_stopwatch_on
            )
    )
}