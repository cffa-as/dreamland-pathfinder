# GitHub Setup Instructions

Follow these steps to push your project to GitHub and set up GitHub Actions for automatic builds:

## 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click on the "+" icon in the top-right corner and select "New repository"
3. Name your repository (e.g., "dreamland-pathfinder")
4. Choose public or private visibility
5. Do not initialize with README, .gitignore, or license since your project already has these files
6. Click "Create repository"

## 2. Initialize Git and Push to GitHub

Install Git if not already installed, then run these commands from your project root:

```bash
# Initialize Git repository
git init

# Add all files to Git
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dreamland-pathfinder.git

# Push to GitHub
git push -u origin main
```

If your default branch is called "master" instead of "main", use:

```bash
git push -u origin master
```

## 3. GitHub Actions Setup

The GitHub Actions workflow file is already included in your project at `.github/workflows/build.yml`. It will automatically trigger when you push to the main branch.

To view your GitHub Actions:
1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see your workflow running after each push

## 4. Troubleshooting GitHub Actions Issues

If you encounter any of the issues mentioned in the requirements:

1. **Node.js Version**: The workflow is already configured to use Node.js 20

2. **gradlew Permissions**: The workflow includes `chmod +x gradlew` to fix permission issues

3. **JDK Version**: The workflow uses JDK 21 instead of the default 17

If you still encounter issues, create a bug report using the template in `.github/ISSUE_TEMPLATE/bug_report.md`. 