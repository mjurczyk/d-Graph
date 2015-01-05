# D-Graph Launcher 0.1.1

# Settings
use_sudo=1

# Read opts
while getopts s:sudo opt
do
  case "$opt" in
    s) use_sudo=0;;
    sudo) use_sudo=0;;
  esac
done

# Shortcut for dependency check
fCheckDependency() {
  echo 'require' $1'...'
  
  if ! node_l="$(type -p $1)" || [ -z "$1" ]; then
    echo '...' $1' not found.'
    return 1
  fi
  
  return 0
}

# P1: Build AWS resources
fLaunchAWS() {
  cd ./node
  
  if [ $use_sudo -eq 1 ]; then
    if node app.js; then
      return 0
    fi
  else 
    if sudo node app.js; then
      return 0
    fi
  fi
  
  cd ..
  
  return 1
}

# P2: Launch Gulp
fLaunchGulp() {
 if ! fCheckDependency 'gulp'; then
    
    # Install Gulp via npm
    # Gulp will build dist version of the tool
    echo 'installing gulpjs...'
    
    npm install --global gulp
    
    echo '... done'
    
  else 
    if [ $use_sudo -eq 1 ]; then
      if ! gulp; then
        # Sometimes, without correct permissions on NPM
        # 'sudo' is required ( same for Grunt )
        echo 'Gulp failed to launch. Try with -sudo.'

      fi
    else
      if ! sudo gulp; then  
        echo 'Gulp cant launch, even with sudo. U sure port 80 is free? '
        echo 'Check port 80, try "[sudo] killall gulp", or change the '
        echo 'port in gulpfile.js [line 34]. '

      fi
    fi
  fi
}

# We need NodeJS and NPM to do
# literally anything
if fCheckDependency 'node' && fCheckDependency 'npm'; then
  if fLaunchAWS; then
  
    fLaunchGulp
    
  fi
else
  echo 'Cannot run the script, NodeJS or NPM not found. Please head to nodejs.org for moar.'  
fi