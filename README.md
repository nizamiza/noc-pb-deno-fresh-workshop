# Using PocketBase, Deno, and Fresh to deploy a production ready app under an hour 🚀

## Preface

This project was built for a workshop at [Night of Chances](https://nightofchances.com) as part of the participation of [UNIIT, s.r.o.](https://uniit.sk) on the event.

Read the [WALKTHROUGH.md](WALKTHROUGH.md) for a detailed guide on how to implement the app.

> &copy; Designed and developed by [Niza Toshpulatov](https://niza.cz), March 2024.

## Introduction

Landscape of web development is ever-changing. There is a new JavaScript framework seemingly every day! There are countless tutorials and guides on how to quickly deploy production-ready apps using popular frameworks and libraries.

In recent years, Deno, a TypeScript-first JavaScript runtime, has gained a fair level of popularity and many frameworks and libraries have emerged around the technology. In this workshop, we will learn how to deploy a production-ready web application using:

- **⛺️ [PocketBase](https://pocketbase.io):** Lightweight, single-executable backend with MySQL database.
- **🦕 [Deno](https://deno.com):** Modern, TypeScript-first JavaScript runtime that focuses on developer experience and Web APIs.
- **🍋 [Fresh](https://fresh.deno.dev):** A Deno-based full-stack framework for building fast and scalable websites.

We will build a simple note-taking app and deploy it to [Deno Deploy](https://deno.com/deploy), a serverless platform for JavaScript applications. We will use [PocketHost](https://pockethost.io) to host our PocketBase instance.

## Outline

- **👩‍🏫 Introduction:** A brief summary of the tech-stack and a general overview of the workshop.
  - A presentation about the technologies.
  - Outline of the workshop.
  - Instructions on guidelines & useful resources.
- **📦 Installation:** Installation of necessary tools and extensions.
  - Installing necessary CLI applications, IDE extensions.
  - Helping out to resolve any technical issues.
- **👨‍💻 Implementation:** Main part of the workshop, implementing the app and resolving any technical issues.
  - Intro to working with Fresh and PocketBase.
  - Basics of PocketBase’s API rules & auth providers.
  - Overview of Fresh’s server-side rendering and interactive islands.
  - Resolving any technical issues.
- **🚀 Deployment:** Deploying the app to production.
  - Releasing the app to Deno Deploy.
  - Monitoring the release & resolving any technical issues.
- **💬 Wrap-up:** Q&A and discussions.
  - Post-release questions and discussions.

## Prerequisites

### Deno CLI

Deno is a modern JavaScript/TypeScript runtime that is used to run the Fresh framework. You can install it using the following command:

```sh
curl -fsSL https://deno.land/install.sh | sh
```

If you are using Windows, you can use this command instead:

```sh
irm https://deno.land/install.ps1 | iex
```

### PocketBase

PocketBase is a lightweight, single-executable backend with MySQL database. You can download the latest release from the [official website](https://pocketbase.io/docs/).

Extract the archive, and move the binary into the root of the repository. For example:

```sh
mv ~/Downloads/pocketbase_0.20.7_darwin_arm64/pocketbase ./
```

> Follow the [walkthrough](WALKTHROUGH.md) if you're participating in the workshop. We will use [PocketHost](https://pockethost.io) to connect to a PocketBase instance.

## Getting started

> This section is intended for this particular implementation of the app. If you're participating in the workshop, follow the [walkthrough](WALKTHROUGH.md) instead.

Create an `.env` file according to the `.env.example` at the root of the repository:

```sh
cp .env.example .env
```

Adjust the environment variables according to your setup.

Start the PocketBase server:

```sh
deno task db:start
```

Then, you can start the application server:

```sh
deno task start
```

> Fore more scripts and commands, check the `tasks` section in the [`deno.json`](./deno.json) file.

That's it, you're ready to rock! 🎸

## Seeding

You can seed the database with some initial data using the following command:

```sh
deno task db:seed
```

> Make sure to have the `POCKET_BASE_SEEDING_ADMIN_USER_` prefixed environmental variables setup in your `.env` file and start the PocketBase server before running the seed command.

## Editor recommendations

Deno has a great ecosystem of extensions for popular editors. You can learn more about them in the [official documentation](https://docs.deno.com/runtime/manual/getting_started/setup_your_environment#using-an-editoride).

## Deployment

You can deploy the app to [Deno Deploy](https://deno.com/deploy). Follow the instructions on [Fresh's official documentation](https://fresh.deno.dev/docs/getting-started/deploy-to-production) to learn more about the process.

To host a PocketBase instance, you can use [PocketHost](https://pockethost.io) service. Once you create an instance, make sure to add its URL to [environmental variables on Deno Deploy](https://docs.deno.com/deploy/manual/environment-variables).

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Resources

- [PocketBase](https://pocketbase.io/docs/)
- [Deno](https://docs.deno.com/runtime/manual)
- [Fresh](https://fresh.deno.dev/docs/getting-started)
