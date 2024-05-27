<script lang="ts" setup>
import { type HTMLAttributes, computed } from 'vue'
import { RangeCalendarCellTrigger, type RangeCalendarCellTriggerProps, useForwardProps } from 'radix-vue'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const props = defineProps<RangeCalendarCellTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <RangeCalendarCellTrigger
    :class="cn(
      buttonVariants({ variant: 'ghost' }),
      'h-9 w-9 p-0 font-normal data-[selected]:opacity-100',
      '[&[data-today]:not([data-selected])]:bg-gray-100 [&[data-today]:not([data-selected])]:text-gray-900 dark:[&[data-today]:not([data-selected])]:bg-gray-800 dark:[&[data-today]:not([data-selected])]:text-gray-50',
      // Selection Start
      'data-[selection-start]:bg-gray-900 data-[selection-start]:text-gray-50 data-[selection-start]:hover:bg-gray-900 data-[selection-start]:hover:text-gray-50 data-[selection-start]:focus:bg-gray-900 data-[selection-start]:focus:text-gray-50 dark:data-[selection-start]:bg-gray-50 dark:data-[selection-start]:text-gray-900 dark:data-[selection-start]:hover:bg-gray-50 dark:data-[selection-start]:hover:text-gray-900 dark:data-[selection-start]:focus:bg-gray-50 dark:data-[selection-start]:focus:text-gray-900',
      // Selection End
      'data-[selection-end]:bg-gray-900 data-[selection-end]:text-gray-50 data-[selection-end]:hover:bg-gray-900 data-[selection-end]:hover:text-gray-50 data-[selection-end]:focus:bg-gray-900 data-[selection-end]:focus:text-gray-50 dark:data-[selection-end]:bg-gray-50 dark:data-[selection-end]:text-gray-900 dark:data-[selection-end]:hover:bg-gray-50 dark:data-[selection-end]:hover:text-gray-900 dark:data-[selection-end]:focus:bg-gray-50 dark:data-[selection-end]:focus:text-gray-900',
      // Outside months
      'data-[outside-month]:pointer-events-none data-[outside-month]:text-gray-500 data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-gray-100/50 [&[data-outside-month][data-selected]]:text-gray-500 [&[data-outside-month][data-selected]]:opacity-30 dark:data-[outside-month]:text-gray-400 dark:[&[data-outside-month][data-selected]]:bg-gray-800/50 dark:[&[data-outside-month][data-selected]]:text-gray-400',
      // Disabled
      'data-[disabled]:text-gray-500 data-[disabled]:opacity-50 dark:data-[disabled]:text-gray-400',
      // Unavailable
      'data-[unavailable]:text-gray-50 data-[unavailable]:line-through dark:data-[unavailable]:text-gray-50',
      props.class,
    )"
    v-bind="forwardedProps"
  >
    <slot />
  </RangeCalendarCellTrigger>
</template>
