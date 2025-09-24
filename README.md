[![GitHub stars](https://img.shields.io/github/stars/3Am-people/3Am-people?style=social)](https://github.com/3Am-people/3Am-people/stargazers) ![License](https://img.shields.io/github/license/3Am-people/3Am-people) [![Twitter Follow](https://img.shields.io/twitter/follow/SuveenE?style=social)](https://x.com/SuveenE)

# 3Am people - AI-powered voice interviewer for hiring 💼

3Am people is a platform for companies to conduct AI powered hiring interviews with their candidates.

## Key Features

- **🎯 Interview Creation:** Instantly generate tailored interview questions from any job description.
- **🔗 One-Click Sharing:** Generate and share unique interview links with candidates in seconds.
- **🎙️ AI Voice Interviews:** Let our AI conduct natural, conversational interviews that adapt to candidate responses.
- **📊 Smart Analysis:** Get detailed insights and scores for each interview response, powered by advanced AI.
- **📈 Comprehensive Dashboard:** Track all candidate performances and overall stats.

Here's a [loom](https://www.loom.com/share/762fd7d12001490bbfdcf3fac37ff173?sid=9a5b2a5a-64df-4c4c-a0e7-fc9765691f81) of me explaining the app.

## Initial Setup

1. Clone the project.
```bash
git clone https://github.com/3Am-people/3Am-people.git
```

2. Copy the existing environment template file
```bash
cp .env.example .env
```

## Clerk Setup ([Clerk](https://clerk.com/))

We use Clerk for authentication. Set up Clerk environment variables in the .env file. Free plan should be more than enough.

1. Navigate to [Clerk](https://dashboard.clerk.com/) and create an application following the [setup guide](https://clerk.com/docs/quickstarts/setup-clerk).

2. Your .env (NOT .env.local) file should have the NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY variables populated with **no inverted commas**

3. Enable organizations in your Clerk application by navigating to the [Organization Settings](https://dashboard.clerk.com/last-active?path=organizations-settings&_gl=1*58xbvk*_gcl_au*MTEzODk3NzAyMy4xNzM4NjQzMzU3*_ga*MzUyMTk4NzIwLjE3Mzg2NDM0NzY.*_ga_1WMF5X234K*MTczODczNzkxOC4zLjEuMTczODczNzkyNi4wLjAuMA..) page.

4. Make sure you create an organization and invite your email to it.

## Database Setup ([Supabase](https://supabase.com/))

Supabase is used for storing the data. It's really simple to set up and the free plan should suffice.

1. Create a project (Note down your project's password)
2. Got to SQL Editor and copy the SQL code from supabase_schema.sql
3. Run the SQL code to confirm the tables are created.
4. Copy the supabase url and anon key from the project settings and paste it in the .env file in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

## Retell AI Setup ([Retell AI](https://retell.ai/))

We use Retell AI to manage all the voice calls. They manage storage of recordings and provide a simple SDK to integrate with. They provide free credits to start with and will have to pay as you go.

1. Create an API key from [Retell AI Dashboard](https://dashboard.retellai.com/apiKey) and add it to the .env file in RETELL_API_KEY

## Add OpenAI API Key

We use OpenAI to generate questions for interviews and analyze responses. This would not be that costly.

1. Go to [OpenAI](https://platform.openai.com/api-keys) and create an API key
2. Add the API key to the .env file in OPENAI_API_KEY

## Video Upload Setup

The application includes chunked video upload functionality that uploads video chunks every 10MB to Supabase storage.

### Quick Setup

1. Add environment variables to your `.env.local`:
```env
SUPABASE_CHEAT_BUCKET=cheat_videos
NEXT_PUBLIC_CHEAT_UPLOAD_URL=/api/upload-vedio
```

2. Create the `cheat_videos` bucket in your Supabase storage dashboard.

## Getting Started locally

First install the packages:
```bash
yarn
```

Run the development server:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Self Hosting

We recommend using [Vercel](https://vercel.com/) to host the app.

## Contributing

If you'd like to contribute to 3Am people, feel free to fork the repository, make your changes, and submit a pull request. Contributions are welcomed and appreciated. For a detailed guide on contributing, read the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Show Your Support 🌟

If you find 3Am people helpful, please consider giving us a star on GitHub! It helps us reach more developers and continue improving the project.

## Products built on top of 3Am people 🚀

- [Talvin AI](https://talvin.ai/)
- [Rapidscreen](https://tryrapidscreen.com/)

## Contact

If you have any questions or feedback, please feel free to reach out to us at [suveen.te1[at]gmail.com](mailto:suveen.te1@gmail.com).

## License

The software code is licensed under the MIT License.
