#!/usr/bin/env ts-node

/* eslint-disable no-console */

import * as path from 'path'
import chalk from 'chalk'
import chokidar from 'chokidar'
import { Command } from 'commander'
import chalkAnimation from 'chalk-animation'
import { compile } from '@dozier/core'

function sleep(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

function resolvePath(relPath: string) {
  return path.resolve(__dirname, '../../..', relPath)
}

async function main() {
  const rainbow = chalkAnimation.rainbow('/n DOZIER /n')
  await sleep(1000)
  rainbow.stop()

  const program = new Command()

  program
    .requiredOption('-f, --functions <path>', 'entry point for functions')
    .requiredOption('-o, --output <path>', 'path for build directory')
    .parse(process.argv)

  const { functions, output } = program.opts<{ functions: string; output: string }>()
  const inputDir = resolvePath(functions)
  const outputDir = resolvePath(output)

  async function buildEverything() {
    console.log(chalk.green('⏳ building...'))
    try {
      await compile(inputDir, outputDir)
      console.log(chalk.green('✅ build successful!'))
    } catch (error) {
      console.error('❌', error)
    }
  }

  buildEverything()

  chokidar
    .watch(inputDir, { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 100, pollInterval: 100 } })
    .on('change', buildEverything)
}

main()
